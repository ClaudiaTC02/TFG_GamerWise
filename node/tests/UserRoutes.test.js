import testServer from "../utils/testServer.js";
import userRoutes from "../routes/UserRoutes.js";
import { hashPassword } from "../utils/userUtils.js";
import ListModel from "../models/ListModel.js";
import GameModel from "../models/GameModel.js";
import ListGameModel from "../models/ListGameModel.js";
import PreferencesModel from "../models/PreferencesModel.js";

const request = testServer(userRoutes);

describe("UserRoutes", () => {
  describe("[ routes / user ]", () => {
    it("should create a new user", async () => {
      // Arrage
      const user = {
        email: "test@test.com",
        name: "test",
        password: "Test12345678!",
      };
      // Act
      const { status, body } = await request.post("/user").send(user);
      // Assert
      expect(status).toEqual(201);
      expect(body.message).toEqual("User created successfully");
    });

    it("should not create a new user with invalid email format", async () => {
      // Arrage
      const userInvalidEmail = {
        email: "test@.com",
        name: "test",
        password: "Test12345678!",
      };
      // Act
      const { status, body } = await request
        .post("/user")
        .send(userInvalidEmail);
      // Assert
      expect(status).toEqual(400);
      expect(body.message).toEqual("Invalid email format");
    });

    it("should not create a new user with incompleted fields", async () => {
      // Arrage
      const userIncomplete = { email: "test@.com", password: "Test12345678!" };
      // Act
      const { status, body } = await request.post("/user").send(userIncomplete);
      // Assert
      expect(status).toEqual(400);
      expect(body.message).toEqual("Required fields");
    });

    it("should not create a new user with invalid data type", async () => {
      // Arrage
      const userInvalidType = {
        email: 1234,
        password: "Test12345678!",
        name: "test",
      };
      // Act
      const { status, body } = await request
        .post("/user")
        .send(userInvalidType);
      // Assert
      expect(status).toEqual(400);
      expect(body.message).toEqual("Invalid data type");
    });

    it("should not create a new user with invalid password", async () => {
      // Arrage
      const userInvalidPass = {
        email: "test@test.com",
        name: "test",
        password: "test",
      };
      // Act
      const { status, body } = await request
        .post("/user")
        .send(userInvalidPass);
      // Assert
      expect(status).toEqual(400);
      expect(body.message).toEqual(
        "Invalid password format, It must contain uppercase, lowercase, symbol and >= 8 length"
      );
    });

    it("should not create a new user with existing email", async () => {
      // Arrage
      const user1 = {
        email: "test@test.com",
        name: "test",
        password: "Test12345678!",
      };
      const user2 = {
        email: "test@test.com",
        name: "user",
        password: "Test12345678!",
      };
      await UserModel.create(user1);
      // Act
      const { status, body } = await request.post("/user").send(user2);
      // Assert
      expect(status).toEqual(400);
      expect(body.message).toEqual("Email already exists");
    });

    it("should not create a new user with empty name", async () => {
      // Arrage
      const userEmptyName = {
        email: "test@test.com",
        name: "",
        password: "Test12345678!",
      };
      // Act
      const { status, body } = await request.post("/user").send(userEmptyName);
      // Assert
      expect(status).toEqual(400);
      expect(body.message).toEqual("Required fields");
    });

    // destroy all items
    afterEach(async () => {
      await UserModel.destroy({ where: {} });
    });
  });

  describe("[routes / user/ login ]", () => {
    beforeAll(async () => {
      const hashedPassword = await hashPassword("Password123?");
      await UserModel.create({
        name: "Claudia",
        password: hashedPassword,
        email: "claudia@gmail.com",
      });
    });
    it("should login a user with valid credentials", async () => {
      // Arrage
      const l_validUser = {
        email: "claudia@gmail.com",
        password: "Password123?",
      };
      // Act
      const { status, body } = await request
        .post("/user/login")
        .send(l_validUser);
      // Assert
      expect(status).toEqual(200);
      expect(body.token).toBeDefined();
    });

    it("should NOT login a user with invalid email", async () => {
      // Arrage
      const l_Invaliduser = {
        email: "tester@gmail.com",
        password: "Password123?",
      };
      // Act
      const { status, body } = await request
        .post("/user/login")
        .send(l_Invaliduser);
      // Assert
      expect(status).toEqual(404);
      expect(body.message).toEqual("User not found or incorrect password");
    });

    it("should NOT login a user with invalid password", async () => {
      // Arrage
      const l_user = { email: "claudia@gmail.com", password: "Password3?" };
      // Act
      const { status, body } = await request.post("/user/login").send(l_user);
      // Assert
      expect(status).toEqual(404);
      expect(body.message).toEqual("User not found or incorrect password");
    });

    it("should NOT login a user with incompleted fields", async () => {
      // Arrage
      const l_Incompleteuser = { password: "Password3?" };
      // Act
      const { status, body } = await request
        .post("/user/login")
        .send(l_Incompleteuser);
      // Assert
      expect(status).toEqual(400);
      expect(body.message).toEqual("Required fields");
    });

    it("should NOT login a user with invalid data types", async () => {
      // Arrage
      const l_InvalidDatauser = { email: "claudia@gmail.com", password: 123 };
      // Act
      const { status, body } = await request
        .post("/user/login")
        .send(l_InvalidDatauser);
      // Assert
      expect(status).toEqual(400);
      expect(body.message).toEqual("Invalid data type");
    });

    it("should NOT login a user with invalid email format", async () => {
      // Arrage
      const l_InvalidEmailuser = {
        email: "@gmail.com",
        password: "Password123?",
      };
      // Act
      const { status, body } = await request
        .post("/user/login")
        .send(l_InvalidEmailuser);
      // Assert
      expect(status).toEqual(400);
      expect(body.message).toEqual("Invalid email format");
    });

    afterAll(async () => {
      await UserModel.destroy({ where: {} });
    });
  });
  describe('[ routes / user / : id]', () => {
    beforeEach(async () => {
      const hashedPassword = await hashPassword("Password123?");
      await UserModel.create({
        name: "Claudia",
        password: hashedPassword,
        email: "claudia@gmail.com",
        id:1
      });
    })

    it('should get data of an existing user', async () => {
      // Arrage
      
      // Act
      const { status, body } = await request.get("/user/1").set('Authorization', `Bearer ${authToken}`);
      // Assert
      expect(status).toEqual(200);
      expect(body.message).toEqual("Information obtained successfully");
      expect(body.info.name).toEqual("Claudia")
    });

    it('should NOT get data of an inexistent user', async () => {
      // Arrage
      
      // Act
      const { status, body } = await request.get("/user/2").set('Authorization', `Bearer ${authToken}`);
      // Assert
      expect(status).toEqual(404);
      expect(body.message).toEqual("User not found");
    });
    
    it('should NOT get data of a user with incorrect id datatype', async () => {
      // Arrage
      
      // Act
      const { status, body } = await request.get("/user/dos").set('Authorization', `Bearer ${authToken}`);
      // Assert
      expect(status).toEqual(400);
      expect(body.message).toEqual("Required id in number format");
    });
    it('should update only the name of a user', async () => {
      // Arrage
      const updateName = {name: "Maria"}
      // Act
      const { status, body } = await request.put("/user/1").set('Authorization', `Bearer ${authToken}`).send(updateName);
      // Assert
      expect(status).toEqual(200);
      expect(body.message).toEqual("User updated successfully");
      expect(body.user.name).toEqual("Maria");
    });
    it('should update only the email of a user', async () => {
      // Arrage
      const updateEmail = {email: "maria@gmail.com"}
      // Act
      const { status, body } = await request.put("/user/1").set('Authorization', `Bearer ${authToken}`).send(updateEmail);
      // Assert
      expect(status).toEqual(200);
      expect(body.message).toEqual("User updated successfully");
      expect(body.user.email).toEqual("maria@gmail.com");
    });
    it('should update only the password of a user', async () => {
      // Arrage
      const updatePassword = {password: "Maria1234?"}
      // Act
      const { status, body } = await request.put("/user/1").set('Authorization', `Bearer ${authToken}`).send(updatePassword);
      // Assert
      expect(status).toEqual(200);
      expect(body.message).toEqual("User updated successfully");
    });
    it('should update the full user', async () => {
      // Arrage
      const updateUser = {name: 'John', email: 'foo@gmail.com', password: 'John1*2354'}
      // Act
      const { status, body } = await request.put("/user/1").set('Authorization', `Bearer ${authToken}`).send(updateUser);
      // Assert
      expect(status).toEqual(200);
      expect(body.message).toEqual("User updated successfully");
    });
    it('should NOT update the the fields with invalid type', async () => {
      // Arrage
      const updateUser = {name: true, email: 'foo@gmail.com', password: 'John1*2354'}
      // Act
      const { status, body } = await request.put("/user/1").set('Authorization', `Bearer ${authToken}`).send(updateUser);
      // Assert
      expect(status).toEqual(400);
      expect(body.message).toEqual("Invalid data types in user data");
    });
    it('should NOT update the the fields with invalid email format', async () => {
      // Arrage
      const updateUser = {email: '@gmail.com'}
      // Act
      const { status, body } = await request.put("/user/1").set('Authorization', `Bearer ${authToken}`).send(updateUser);
      // Assert
      expect(status).toEqual(400);
      expect(body.message).toEqual("Invalid email format");
    });
    it('should NOT update the the fields with invalid password format', async () => {
      // Arrage
      const updateUser = {password: 'aaaaa'}
      // Act
      const { status, body } = await request.put("/user/1").set('Authorization', `Bearer ${authToken}`).send(updateUser);
      // Assert
      expect(status).toEqual(400);
      expect(body.message).toEqual("Invalid password format, It must contain uppercase, lowercase, symbol and >= 8 length");
    });
    it('should NOT update the the data of an inexistent user', async () => {
      // Arrage
      const updateUser = {password: 'Prueba1234^'}
      // Act
      const { status, body } = await request.put("/user/5").set('Authorization', `Bearer ${authToken}`).send(updateUser);
      // Assert
      expect(status).toEqual(404);
      expect(body.message).toEqual("User not found");
    });
    it('should delete a user', async () => {
      // Arrage
      // Act
      const { status, body } = await request.delete("/user/1").set('Authorization', `Bearer ${authToken}`);
      // Assert
      expect(status).toEqual(200);
      expect(body.message).toEqual("User deleted successfully");
    });
    it('should delete a user with relations', async () => {
      // Arrage
      await ListModel.create({name: "test", id: 1, user_id: 1});
      await GameModel.create({
        name: "test",
        company: "test company",
        gender: "test gender",
        platforms: "name, name",
        max_players: 40,
        id: 1,
      });
      await ListGameModel.create({list_id: 1, game_id: 1});
      await PreferencesModel.create({rating: 1, user_id: 1, game_id: 1});
      // Act
      const { status, body } = await request.delete("/user/1").set('Authorization', `Bearer ${authToken}`);
      // Assert
      expect(status).toEqual(200);
      expect(body.message).toEqual("User deleted successfully");
      // verify relations delete
      const listGameCount = await ListGameModel.count({ where: { list_id: 1 } });
      expect(listGameCount).toEqual(0);
      const preferencesCount = await PreferencesModel.count({ where: { user_id: 1 } });
      expect(preferencesCount).toEqual(0);
      const listCount = await ListModel.count({ where: { user_id: 1 } });
      expect(listCount).toEqual(0);
    });
    it('should NOT delete an inexistent user', async () => {
      // Arrage
      // Act
      const { status, body } = await request.delete("/user/5").set('Authorization', `Bearer ${authToken}`);
      // Assert
      expect(status).toEqual(404);
      expect(body.message).toEqual("User not found");
    });
    it('should NOT delete a user with incorrect data type', async () => {
      // Arrage
      // Act
      const { status, body } = await request.delete("/user/uno").set('Authorization', `Bearer ${authToken}`);
      // Assert
      expect(status).toEqual(400);
      expect(body.message).toEqual("Required id in number format");
    });
    afterEach(async () => {
      await UserModel.destroy({ where: {} });
    });
    afterAll(async () => {
      await UserModel.destroy({ where: {} });
      await ListModel.destroy({ where: {} });
      await GameModel.destroy({ where: {} });
      await ListGameModel.destroy({ where: {} });
    })
  });
});
