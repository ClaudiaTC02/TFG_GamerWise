import { Sequelize } from "sequelize";

const dbConfig = {
  production: {
    database: "gamerwise_db",
    username: "root",
    password: "",
    host: "localhost",
    dialect: "mysql",
  },
  test: {
    database: "gamerwise_db_test",
    username: "root",
    password: "",
    host: "localhost",
    dialect: "mysql",
  },
};

const getDBInstance = () => {
    const env = process.env.NODE_ENV || 'production';
    console.log(env)
    const config = dbConfig[env];
    return new Sequelize(config.database, config.username, config.password, {
      host: config.host,
      dialect: config.dialect
    });
  };
  
  const db = getDBInstance();
  
  export default db;
