//LIFE4 MESSENGER - PART OF DDR BOT
//Created by Steve Sefchick - 2020-2022
//Used for discord interaction
//built using NodeJS

//TODO: Add to README.md

//TODO: Create functon for connection

require('dotenv').config();

/*
var mysqlv2 = require('mysql2');
const { Client } = require('ssh2');
const sshClient = new Client();
var connection2 = {
	host     : process.env.MYSQLHOST,
	user     : process.env.MYSQLUSER,
	password : process.env.MYSQLPW,
	database : process.env.MYSQLPLAYERDB
  };
*/

//debug variables
var isDebug = false;

const fs = require('fs');

var Discord = require('discord.js');
var bot = new Discord.Client();
bot.login(process.env.DISCORD_BOT_TOKEN);


const express = require('express');
const app = express();
const port = process.env.PORT;
//waitfor
var wait = require('wait.for');

var mysql = require('mysql');
var connection;

//experimental zone
//
//

/*
var mysqlv2 = require('mysql2');
const { Client } = require('ssh2');
const sshClient = new Client();
*/
//var database = require('./db.js');



/*
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
*/




//
//
//end experimental zone


//BOT LOG IN
bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);

  });


  //Function to look for new members
  /*
  bot.on('guildMemberAdd', member => {
    const channel = member.guild.channels.find(ch => ch.name === 'general-chat');
    const postchannel = bot.channels.find('name', 'general-chat');
    const LOG_CHANNEL_ID = `<#531607424650444820>`;

    var message = `Welcome ${member} to LIFE4! Feel free to tell us a bit about yourself in `+LOG_CHANNEL_ID+`. \n Also, what's your favorite DDR song and why is it...`;
    


    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    postchannel.send(message);
  });
*/


//BOT LISTEN FOR MESSAGES
  bot.on('message', (message) => {
    let myRole = message.guild.roles.cache.get("530615149531365393");

    
    var msg = message.content;
    if (msg.startsWith('<@!')) {
			msg = msg.replace('!','');
		}

    //GET COMMANDS
    if(msg.includes(bot.user.toString()) && msg.includes('commands')) {
        message.reply('Here are my commands!\nturn on - enable the bot, which will look for new "approved" forms every 10 minutes\nget submissions - get all submissions ready to be reviewed\n status = get status \n check queue - no longer used \n check players - no longer used \n check trials - no longer used \n turn off = disable the bot');
    }
    

    //GET STATUS
    if(msg.includes(bot.user.toString()) && msg.includes('status')) {

      if (message.channel.id === '596168285477666832')
      {
        wait.launchFiber(getAppStatusSequenceDiscord,message);

      }

    }

    //DISCORD @ TEST
    if(msg.includes(bot.user.toString()) && msg.includes('mysql test')) {
      if (message.channel.id === '596168285477666832')
      {
        wait.launchFiber(changeAppStatusSequenceDiscord,message,"NEWQUEUE");

      }
    }

    //GET NUMBER OF NEW SUBMISSIONS IN QUEUE
    if(msg.includes(bot.user.toString()) && msg.includes('get submissions')) {
      if (message.channel.id === '596168285477666832')
      {
        wait.launchFiber(getAllSubmissionsInForms,message,"SUBMISSIONS");

      }
    }

    //TURN ON
    if(msg.includes(bot.user.toString()) && msg.includes('turn on')) {

      if (message.channel.id === '596168285477666832')
      {
        wait.launchFiber(changeAppStatusSequenceDiscord,message,"ON");

      }
      
    }

    //CHECK QUEUE
    if(msg.includes(bot.user.toString()) && msg.includes('check queue')) {

      if (message.channel.id === '596168285477666832')
      {
        wait.launchFiber(changeAppStatusSequenceDiscord,message,"QUEUE");

      }
    }

    //CHECK PLAYERS
    if(msg.includes(bot.user.toString()) && msg.includes('check players')) {

      if (message.channel.id === '596168285477666832')
      {
        wait.launchFiber(changeAppStatusSequenceDiscord,message,"PLAYERS");

      }
    }


    //CHECK TRIALS
    if(msg.includes(bot.user.toString()) && msg.includes('check trials')) {

      if (message.channel.id === '596168285477666832')
      {
        wait.launchFiber(changeAppStatusSequenceDiscord,message,"TRIALS");

      }
    }


    //TURN OFF
    if(msg.includes(bot.user.toString()) && msg.includes('turn off')) {

      if (message.channel.id === '596168285477666832')
      {
        wait.launchFiber(changeAppStatusSequenceDiscord,message,"OFF");

      }
    }

});



app.listen(port, () => console.log(`Listening on port ${port}!`));


//
//GENERAL API FUNCTIONS
//
function sendTheBoy(res,deets,callback)
{
  setTimeout( function(){

    res.send(JSON.stringify(deets));

}, 750);

}
  //TEST
  app.get("/api/test", function(req, res) {
    res.status(200).json("the dang test worked!");
  });

  



//
//GET STATUS
//


//GET APP STATUS
app.get("/api/app/status", function(req, res) {
   
  wait.launchFiber(getAppStatusSequence,req,res);
});

function discordSendStatusMessage(message,status,callback)
{
  setTimeout( function(){

    var messagetext = "";

    if (status == "ON")
    {
      messagetext = "Status is currently " + status +"! The bot is running and looking for approved forms!";
    }
    else if (status == "OFF")
    {
      messagetext = "Status is currently " + status +"! The bot is not running!";
    }
    else if (status == "ERROR")
    {
      messagetext = "Status is currently " + status +"! Uh oh! Tell my Dad!";
    }


    message.reply(messagetext);

}, 750);

}
function getAppStatusFromDB(callback){

  setTimeout( function(){

    var appStatus = "SELECT varValue from life4controls where varName='appStatus'";
    
    connection.query(appStatus, function (error, results) {
      if (error) throw error;
      callback(null,results)
    });
    
}, 25);

}

function getSubmissionCount(callback){

  setTimeout( function(){

    var appStatus = "select COUNT(*) as 'subcount' from wp_kikf_postmeta where meta_key='state' and meta_value='submitted'";
    connection.query(appStatus, function (error, results) {
      if (error) throw error;
      callback(null,results)

    });
    
}, 25);

}

function updatedSubmissionToReported(callback){

  setTimeout( function(){

    console.log("updating");
    var appStatus = "update wp_kikf_postmeta set meta_value='submission_reported' where meta_key='state' and meta_value='submitted'";
    connection.query(appStatus, function (error, results) {
      if (error) throw error;
      console.log("gonna update");
      callback(null,results)

    });
    
}, 25);

}


function getAppStatusSequence(req,res)
{

    connection = mysql.createConnection({
      host     : process.env.MYSQLHOST,
      user     : process.env.MYSQLUSER,
      password : process.env.MYSQLPW,
      database : process.env.MYSQLPLAYERDB
    });
    connection.connect();

    var currentStatus = wait.for(getAppStatusFromDB);

  console.log("Checking Status!");

  wait.for(sendTheBoy,res,currentStatus);
};




function getAppStatusSequenceDiscord(message)
{
  //if (isDebug == false)
  //{
  connection = mysql.createConnection({
    host     : process.env.MYSQLHOST,
    user     : process.env.MYSQLUSER,
    password : process.env.MYSQLPW,
    database : process.env.MYSQLPLAYERDB
  });
  connection.connect();

  //}
  /*
  else if (isDebug == true)
  {
    console.log("step 1, i am here");
    //new
    var new_connection = wait.for(getSSHConnection);
    var new_connection2 = wait.for(getSSHConnection2,new_connection);
    console.log(new_connection);
    console.log(new_connection2);

  }
  */

  console.log("Checking Status!");

  var currentStatus = wait.for(getAppStatusFromDB);
  wait.for(discordSendStatusMessage,message,currentStatus[0].varValue);
};


function getAllSubmissionsInForms(message)
{
  //if (isDebug == false)
  //{
  connection = mysql.createConnection({
    host     : process.env.MYSQLHOST,
    user     : process.env.MYSQLUSER,
    password : process.env.MYSQLPW,
    database : process.env.MYSQLPLAYERDB
    
  });
  connection.connect();
  //}
  //else if (isDebug == true)
  //{

  //}

  console.log("Checking submissions");
  var currentStatus = wait.for(getSubmissionCount);
  console.log(currentStatus[0].subcount);
  var updatestate = wait.for(updatedSubmissionToReported);
  wait.for(discordSendSubmissionMessage,message,currentStatus[0].subcount);

};

//
// TEST
//


function discordSendTestAtMessage(message,callback)
{
  setTimeout( function(){

    var messagetext = "";

    var userid = bot.users.cache.find(u => u.tag === 'stevesefchick#7960').id;

    var id = "<@" + userid + ">";

    console.log("userid = " + id);
      messagetext = "Hello " + id + " this is a test";

    message.reply(messagetext);

}, 750);

}



//
// CHANGE STATUS
//


//API
app.get("/api/app/status/change", function(req, res) {
   
  var value = req.query.status;

  if (value == undefined ||
    (value != "ON" &&
    value !="OFF"))
    {
      res.status(400).json("Invalid status");
    }
    else
    {
  wait.launchFiber(changeAppStatusSequence, value,req,res);
    }
});


function changeAppStatus(status,callback){

  setTimeout( function(){

    var appStatus = "UPDATE life4controls set varValue = '"+status+"' where varName='appStatus'";
    connection.query(appStatus, function (error, results) {
      if (error) throw error;
      callback(null,results)

    });
    
}, 25);

}

function discordSendSubmissionMessage(message,countofgoods,callback)
{
  setTimeout( function(){

    var messagetext = "There are " + countofgoods + " in the form queue ready to be reviewed!";

    message.reply(messagetext);

}, 750);
}


function discordSendStatusChangeMessage(message,status,callback)
{
  setTimeout( function(){

    var messagetext = "";

    if (status == "ON")
    {
      messagetext = "The bot has been enabled and will now look for newly approved forms!";
    }
    else if (status == "OFF")
    {
      messagetext = "The bot has been deactivated! ";
    }
    else if (status == "TRIALS")
    {
      messagetext = "The bot will now check for new trials!";
    }
    else if (status == "PLAYERS")
    {
      messagetext = "The bot will now check for new players!";
    }
    else if (status == "QUEUE")
    {
      messagetext = "The bot will now work through updates in the queue! It will run every 10 minutes!";
    }
    else if (status == "TOURNEYSYNC")
    {
      messagetext = "spreadsheet sync test";
    }
    else if (status == "TOURNEYANNOUNCE")
    {
      messagetext = "rr announcement test";
    }

    message.reply(messagetext);

}, 750);

}


function changeAppStatusSequence(status,req,res)
{
  if (isDebug == false)
  {
  connection = mysql.createConnection({
    host     : process.env.MYSQLHOST,
    user     : process.env.MYSQLUSER,
    password : process.env.MYSQLPW,
    database : process.env.MYSQLPLAYERDB
  });
  connection.connect();
  }
  else if (isDebug == true)
  {

  }

  console.log("Updating Status!!");
  var currentStatus = wait.for(changeAppStatus,status);
  wait.for(sendTheBoy,res,currentStatus);
};

function changeAppStatusSequenceDiscord(message,status)
{
  if (isDebug == false)
  {
  connection = mysql.createConnection({
    host     : process.env.MYSQLHOST,
    user     : process.env.MYSQLUSER,
    password : process.env.MYSQLPW,
    database : process.env.MYSQLPLAYERDB
  });
  connection.connect();
  }
  else if (isDebug == true)
  {
    connection2.connect();
  }

  console.log("Updating status!");
  var currentStatus = wait.for(changeAppStatus,status);
  wait.for(discordSendStatusChangeMessage,message,status);
};

//check for needed activity
var life4actionTime = function()
{
    console.log('App is running!!!');
}


life4actionTime();
