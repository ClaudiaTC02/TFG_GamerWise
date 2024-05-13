//connection db
import db from "../database/db.js";
import DataType from "sequelize";

const UserModel = db.define(
  "user",
  {
    //Atributes
    email: {
      type: DataType.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isSteamUser() {
          // Verifica si el usuario tiene un Steam ID asociado
          if (!this.steam_token && !this.email) {
            throw new Error(
              "El correo electrónico es requerido para usuarios sin Steam ID"
            );
          }
        },
      },
    },
    name: {
      type: DataType.STRING,
      allowNull: false,
    },
    password: {
      type: DataType.STRING,
      allowNull: true,
      validate: {
        isSteamUser() {
          // Verifica si el usuario tiene un Steam ID asociado
          if (!this.steam_token && !this.password) {
            throw new Error(
              "La contraseña es requerida para usuarios sin Steam ID o correo electrónico"
            );
          }
        },
      },
    },
    steam_token: {
      type: DataType.BIGINT,
      //allow null TRUE
    },
  },
  {
    //Other model options
    freezeTableName: true, // stip the auto-pluralization
    timestamps: false,
  }
);
export default UserModel;
