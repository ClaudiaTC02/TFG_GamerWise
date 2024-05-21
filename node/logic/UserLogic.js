import UserModel from "../models/UserModel.js";
import ListModel from "../models/ListModel.js";
import PreferencesModel from "../models/PreferencesModel.js";
import ListGameModel from "../models/ListGameModel.js";
import bcrypt from "bcrypt";
import {
  validateRequiredFields,
  validateEmail,
  validateDataTypes,
  validatePassword,
  hashPassword,
  generateAuthToken,
  validateDataTypesUpdate,
} from "../utils/userUtils.js";
import GameModel from "../models/GameModel.js";

//----------------------------------------------------------------------
// CRUD Methods
//----------------------------------------------------------------------

// Create user logic
export const createUserLogic = async (email, name, password) => {
  try {
    if (
      !validateRequiredFields({ email, name, password }, [
        "email",
        "name",
        "password",
      ])
    ) {
      throw new Error("Required fields");
    }

    if (!validateDataTypes({ email, name, password })) {
      throw new Error("Invalid data type");
    }

    if (!validateEmail(email)) {
      throw new Error("Invalid email format");
    }

    if (!validatePassword(password)) {
      throw new Error(
        "Invalid password format, It must contain uppercase, lowercase, symbol and >= 8 length"
      );
    }

    const hashedPassword = await hashPassword(password);
    const user = await UserModel.create({
      email,
      name,
      password: hashedPassword,
    });
    await ListModel.create({
      name: "Playing",
      user_id: user.id,
      description: "Games currently Playing",
    });
    await ListModel.create({
      name: "Completed",
      user_id: user.id,
      description: "Games Completed",
    });
    await ListModel.create({
      name: "Like",
      user_id: user.id,
      description: "Games that I Liked",
    });
    await ListModel.create({
      name: "Dropped",
      user_id: user.id,
      description: "Games dropped",
    });

    return { success: true };
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return { success: false, error: "Email already exists" };
    }
    return { success: false, error: error.message };
  }
};

// Login logic
export const loginLogic = async (email, password) => {
  try {
    if (!validateRequiredFields({ email, password }, ["email", "password"])) {
      throw new Error("Required fields");
    }

    if (!validateDataTypes({ email, password })) {
      throw new Error("Invalid data type");
    }

    if (!validateEmail(email)) {
      throw new Error("Invalid email format");
    }

    const user = await UserModel.findOne({
      where: { email: email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("User not found or incorrect password");
    }

    const token = generateAuthToken(user.id);
    return { success: true, user, token };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get basic information by id logic
export const getBasicInfoLogic = async (id) => {
  try {
    id = Number(id);
    if (!id) {
      throw new Error("Required id in number format");
    }

    const user = await UserModel.findByPk(id);
    if (!user) {
      throw new Error("User not found");
    }

    return {
      success: true,
      info: { name: user.name, steam: user.steam_token, email: user.email },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get buser by steam_token
export const getUserBySteamToken = async (steam_token) => {
  try {
    if (!steam_token) {
      throw new Error("Required steam_token");
    }
    const user = await UserModel.findOne({
      where: { steam_token: steam_token },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update a user
export const updateUserLogic = async (id, userData) => {
  try {
    id = Number(id);
    if (!id) {
      throw new Error("Required id in number format");
    }
    const user = await UserModel.findByPk(id);
    if (!user) {
      throw new Error("User not found");
    }

    if (!validateDataTypesUpdate(userData)) {
      throw new Error("Invalid data types in user data");
    }
    if (userData.email) {
      if (!validateEmail(userData.email)) {
        throw new Error("Invalid email format");
      }
    }

    if (userData.password) {
      if (!validatePassword(userData.password)) {
        console.log("Invalid password");
        throw new Error(
          "Invalid password format, It must contain uppercase, lowercase, symbol and >= 8 length"
        );
      }
      if (!(await bcrypt.compare(userData.password_before, user.password))) {
        throw new Error("Passwords doen not match");
      }
      const hashedPassword = await hashPassword(userData.password);
      userData.password = hashedPassword;
    }
    await user.update(userData);

    return { success: true, user: user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// delete a user
export const deleteUserLogic = async (id) => {
  try {
    id = Number(id);
    if (!id) {
      throw new Error("Required id in number format");
    }

    const user = await UserModel.findByPk(id);
    if (!user) {
      throw new Error("User not found");
    }

    // delete relations
    await ListModel.destroy({ where: { user_id: id } });
    await ListGameModel.destroy({ where: { list_id: null } });
    await PreferencesModel.destroy({ where: { user_id: id } });

    await user.destroy();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// delete steam_token of a user
export const deleteSteamLogic = async (id) => {
  try {
    id = Number(id);
    if (!id) {
      throw new Error("Required id in number format");
    }

    const user = await UserModel.findByPk(id);
    if (!user) {
      throw new Error("User not found");
    }

    // delete relations
    user.steam_token = null;
    await user.save();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// get users, games and ratings
export const getUsersGamesAndRatingsLogic = async () => {
  try {
    const info = await PreferencesModel.findAll({
      include: [
        {
          model: UserModel,
          attributes: ["id", "name"],
        },
        {
          model: GameModel,
          attributes: ["igdb_id", "name"],
        },
      ],
    });
    const info_mapped = info.map((inf) => ({
      user: {
        id: inf.user.id,
        name: inf.user.name,
      },
      game: {
        igdb_id: inf.game.igdb_id,
        name: inf.game.name,
      },
      rating: inf.rating,
    }));
    const games = await GameModel.findAll({
      attributes: ["igdb_id", "name"],
      include: [
        {
          model: ListModel,
          where: {
            name: ["Like", "Completed", "Playing"],
          },
          through: { model: ListGameModel },
          include: [
            {
              model: UserModel,
              attributes: ["id", "name"],
            },
          ],
        },
      ],
    });
    const games_mapped = games.flatMap((game) => {
      return game.lists.flatMap((list) => {
        if (list.user) {
          return {
            user: {
              id: list.user.id,
              name: list.user.name,
            },
            game: {
              id: game.igdb_id,
              name: game.name,
            },
            rating: null,
          };
        }
      });
    });
    const combined_info = [...info_mapped, ...games_mapped].filter(
      (item) => item.user && item.game
    );
    combined_info.forEach((item) => {
      if (item.rating === null) {
        item.rating = 3;
      }
    });
    return { success: true, info: combined_info };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
