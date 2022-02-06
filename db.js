var mysqlv2 = require('mysql2');
const { Client } = require('ssh2');
const sshClient = new Client();
require('dotenv').config();

var connection2 = {
	host     : process.env.MYSQLHOST,
	user     : process.env.MYSQLUSER,
	password : process.env.MYSQLPW,
	database : process.env.MYSQLPLAYERDB
  };
  

var db = new Promise(function(resolve, reject){
	sshClient.on('ready', function() {
	  sshClient.forwardOut(
	    // source address, this can usually be any valid address
      '127.0.0.1',
	    // source port, this can be any valid port number
      3306,
	    // destination address (localhost here refers to the SSH server)
		process.env.SSH_HOST,
	    // destination port
		process.env.SSH_PORT,
	    function (err, stream) {
	      if (err) throw err; // SSH error: can also send error in promise ex. reject(err)
	      // use `sql` connection as usual
	      	connection2 = mysqlv2.createConnection({
	          host     : process.env.MYSQLHOST,
	          user     : process.env.MYSQLUSER,
	          password : process.env.MYSQLPW, 
	          database : process.env.MYSQLPLAYERDB,
            stream :stream
	        });

	        // send connection back in variable depending on success or not
		connection2.connect(function(err){
			if (err) {
				resolve(connection2);
			} else {
				reject(err);
			}
		});
	  });
	}).connect({
	  host: process.env.SSH_HOST,
	  port: process.env.SSH_PORT,
	  username: process.env.SSH_USER,
	  privateKey: require('fs').readFileSync('C:\\Users\\Steve\\Desktop\\keys\\privkey_openssh')
	});
});

module.exports = db;