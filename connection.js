var mysql = require('mysql');
//debug variables
var isDebug = true;


//Make a database connection
function GetConnection(){
    return new Promise((resolve) => {
      setTimeout(() => {
  
        if (isDebug)
        {
          console.log("ok!");
          resolve("debug");
          
        }
        else
        {
          var connection = mysql.createConnection({
            host     : process.env.MYSQLHOST,
            user     : process.env.MYSQLUSER,
            password : process.env.MYSQLPW,
            database : process.env.MYSQLPLAYERDB
          });
          connection.connect();
          console.log("connected!");
          resolve(connection);
        }
  
      }, 5000);
  
  });
  };

module.exports = {
    connection : GetConnection()
};
