const mysql = require("mysql");

module.exports = async () =>
  new Promise((resolve, reject) => {
    const connection = mysql.createConnection({
      // host: "localhost",
      // user: "root",
      // password: "admin"
      host: "taskzerodb.cm23ylawjbiy.us-east-1.rds.amazonaws.com",
      user: "admin",
      password: "KA01hh8469",
    });
    
    connection.connect((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(connection);
    });
  });