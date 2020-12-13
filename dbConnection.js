/* eslint-disable no-useless-catch */
const mysql = require('promise-mysql');

const config = require('./config');

const dbConfig = {
  host: ENV['host'],
  user: ENV['user'],
  password: ENV['password'],
  port: ENV['port'],
  database: ENV['db'],
  connectionLimit: 10,
};

module.exports = async () => {
  try {
    let pool;
    let con;
    if (pool) con = pool.getConnection();
    else {
      pool = await mysql.createPool(dbConfig);
      con = pool.getConnection();
    }
    return con;
  } catch (ex) {
    throw ex;
  }
};

/*mark*/