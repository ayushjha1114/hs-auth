const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  local: {
    username: process.env.PGSQL_USERNAME,
    password: process.env.PGSQL_PASSWORD,
    database: process.env.PGSQL_DATABASE_NAME,
    host: process.env.PGSQL_HOST,
    dialect: 'postgres'
  },
  development: {
    username: process.env.PGSQL_USERNAME,
    password: process.env.PGSQL_PASSWORD,
    database: process.env.PGSQL_DATABASE_NAME,
    host: process.env.PGSQL_HOST,
    dialect: 'postgres'
  }
};
