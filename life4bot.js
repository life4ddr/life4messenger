//LIFE4 MESSENGER - PART OF DDR BOT
//Created by Steve Sefchick - 2020-2021
//Used for discord interaction
//built using NodeJS

//TODO: Add to README.md

const fs = require('fs');
//var twit = require('twit');
var config = require('./config.js');
//var Twitter = new twit(config);


var Discord = require('discord.js');
var bot = new Discord.Client();
bot.login(process.env.DISCORD_BOT_TOKEN);


//BOT LOG IN
bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);

  });


  //Function to look for new members
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



//BOT LISTEN FOR MESSAGES
  bot.on('message', (message) => {
    let myRole = message.guild.roles.cache.get("530615149531365393");

    
    var msg = message.content;
    if (msg.startsWith('<@!')) {
			msg = msg.replace('!','');
		}

    //GET COMMANDS
    if(msg.includes(bot.user.toString()) && msg.includes('commands')) {
        message.reply('Here are my commands!\n status = get status \n check queue - begin to message any updates in the queue \n check players - check the players spreadsheet for any updates \n check trials - check the trials spreadsheets for any updates \n turn off = disable the bot');
    }
    

    //GET STATUS
    if(msg.includes(bot.user.toString()) && msg.includes('status')) {

      if (message.channel.id === '596168285477666832')
      {
        wait.launchFiber(getAppStatusSequenceDiscord,message);

      }

    }

    //DISCORD @ TEST
    if(msg.includes(bot.user.toString()) && msg.includes('test dis')) {
      if (message.channel.id === '596168285477666832')
      {
        wait.launchFiber(getAppTestSequenceDiscord,message);

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

    //TOURNEY SYNC 
    if(msg.includes(bot.user.toString()) && msg.includes('rr sync')) {

      if (message.channel.id === '596168285477666832')
      {
        wait.launchFiber(changeAppStatusSequenceDiscord,message,"TOURNEYSYNC");

      }
    }
    

      //TOURNEY ANNOUNCE 
      if(msg.includes(bot.user.toString()) && msg.includes('rr announce')) {

        if (message.channel.id === '596168285477666832')
        {
          wait.launchFiber(changeAppStatusSequenceDiscord,message,"TOURNEY ANNOUNCE");
  
        }
      }

    //TURN OFF
    if(msg.includes(bot.user.toString()) && msg.includes('turn off')) {

      if (message.channel.id === '596168285477666832')
      {
        wait.launchFiber(changeAppStatusSequenceDiscord,message,"OFF");

      }
    }

    //PLAYER LOOKUP
    if(msg.includes(bot.user.toString()) && msg.includes('whois')) {
      message.reply('TBD player lookup');
  }
});








require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT;
//waitfor
var wait = require('wait.for');

var mysql = require('mysql');
var connection;



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
      messagetext = "Status is currently " + status +"! The bot is running!";
    }
    else if (status == "OFF")
    {
      messagetext = "Status is currently " + status +"! The bot is not running!";
    }
    else if (status == "QUEUE")
    {
      messagetext = "Status is currently " + status +"! The bot is checking the queue for new updates and then sending messages";
    }
    else if (status == "PLAYERS")
    {
      messagetext = "Status is currently " + status +"! The bot is scanning the spreadsheet for player updates!!";
    }
    else if (status == "TRIALS")
    {
      messagetext = "Status is currently " + status +"! The bot is scanning the spreadsheet for new trial scores!";
    }
    else if (status == "TOURNEYSYNC")
    {
      messagetext = "Status is currently " + status +"! The bot is syncing the spreadsheets";
    }
    else if (status == "TOURNEYANNOUNCE")
    {
      messagetext = "Status is currently " + status +"! The bot is going to announce tournament scores ";
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

    var appStatus = "SELECT varValue from life4Controls where varName='appStatus'";
    connection.query(appStatus, function (error, results) {
      if (error) throw error;
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

  console.log("CheckingStatus!");
  var currentStatus = wait.for(getAppStatusFromDB);
  wait.for(sendTheBoy,res,currentStatus);
};

function getAppStatusSequenceDiscord(message)
{
  connection = mysql.createConnection({
    host     : process.env.MYSQLHOST,
    user     : process.env.MYSQLUSER,
    password : process.env.MYSQLPW,
    database : process.env.MYSQLPLAYERDB
  });
  connection.connect();

  console.log("Checking Status!");
  var currentStatus = wait.for(getAppStatusFromDB);
  wait.for(discordSendStatusMessage,message,currentStatus[0].varValue);
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

function getAppTestSequenceDiscord(message)
{
  connection = mysql.createConnection({
    host     : process.env.MYSQLHOST,
    user     : process.env.MYSQLUSER,
    password : process.env.MYSQLPW,
    database : process.env.MYSQLPLAYERDB
  });
  connection.connect();

  console.log("HARSE!");
  wait.for(discordSendTestAtMessage,message);
};





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

    var appStatus = "UPDATE life4Controls set varValue = '"+status+"' where varName='appStatus'";
    connection.query(appStatus, function (error, results) {
      if (error) throw error;
      callback(null,results)

    });
    
}, 25);

}

function discordSendStatusChangeMessage(message,status,callback)
{
  setTimeout( function(){

    var messagetext = "";

    if (status == "ON")
    {
      messagetext = "This doesn't really do anything anymore! Please use 'check trials', 'check players', or 'check queue' to do a thing!";
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
  connection = mysql.createConnection({
    host     : process.env.MYSQLHOST,
    user     : process.env.MYSQLUSER,
    password : process.env.MYSQLPW,
    database : process.env.MYSQLPLAYERDB
  });
  connection.connect();

  console.log("Updating Status!!");
  var currentStatus = wait.for(changeAppStatus,status);
  wait.for(sendTheBoy,res,currentStatus);
};

function changeAppStatusSequenceDiscord(message,status)
{
  connection = mysql.createConnection({
    host     : process.env.MYSQLHOST,
    user     : process.env.MYSQLUSER,
    password : process.env.MYSQLPW,
    database : process.env.MYSQLPLAYERDB
  });
  connection.connect();

  console.log("Updating status!");
  var currentStatus = wait.for(changeAppStatus,status);
  wait.for(discordSendStatusChangeMessage,message,status);
};




//
// GET ALL PLAYERS
//

//API
app.get("/api/players/all", function(req, res) {
   
  wait.launchFiber(getAllPlayersSequence,req,res);

});

function getAllPlayersfromDB(callback){

  setTimeout( function(){

    var playerAllQuery = "SELECT * from playerList";
    connection.query(playerAllQuery, function (error, results) {
      if (error) throw error;
      callback(null,results)

    });
    
}, 25);

}

function getAllPlayersSequence(req,res)
{
  connection = mysql.createConnection({
    host     : process.env.MYSQLHOST,
    user     : process.env.MYSQLUSER,
    password : process.env.MYSQLPW,
    database : process.env.MYSQLPLAYERDB
  });
  connection.connect();

  console.log("Time for test!");
  var allplayers = wait.for(getAllPlayersfromDB);
  wait.for(sendTheBoy,res,allplayers);
};


//
// GET SINGLE PLAYER
//

 //API
 app.get("/api/player", function(req, res) {
   
  //get the player's name
  var name = req.query.name;

  
  //if no name
  if (name == undefined)
  {
    res.status(400).json("Missing a name!");
  }
  //name found
  else
  {
  wait.launchFiber(getSinglePlayerSequence, name, req,res);
  }
});

function getSinglePlayerFromDB(playername, callback){

  setTimeout( function(){

    var playerOneQuery = "SELECT * from playerList where playerName = '"+playername+"'";
    connection.query(playerOneQuery, function (error, results) {
      if (error) throw error;
      callback(null,results)

    });
    
}, 25);

}


function getSinglePlayerSequence(playername,req,res)
{
  connection = mysql.createConnection({
    host     : process.env.MYSQLHOST,
    user     : process.env.MYSQLUSER,
    password : process.env.MYSQLPW,
    database : process.env.MYSQLPLAYERDB
  });
  connection.connect();

  var oneplayer = wait.for(getSinglePlayerFromDB,playername);
  wait.for(sendTheBoy,res,oneplayer);
};


//
// GET TOP TRIALS
//

//API
app.get("/api/trial", function(req, res) {
   
  //get the player's name
  var trialname = req.query.name;
  var limit = req.query.limit;

  if (limit == undefined)
  {
    limit = 99999;
  }

  //if no name
  if (trialname == undefined)
  {
    res.status(400).json("Trial name must be included!");
  }
  //name found
  else
  {
    wait.launchFiber(getTopTrialSequence, trialname,limit, req,res);
  }


});

function translateTrialName(trialName)
{
  if (trialName == "heartbreak")
  {
    trialName = "HEARTBREAK (12)";
  }
  else if (trialName == "celestial")
  {
    trialName = "CELESTIAL (13)";
  }
  else if (trialName == "daybreak")
  {
    trialName = "DAYBREAK (14)";
  }
  else if (trialName == "hellscape")
  {
    trialName = "HELLSCAPE (15)";
  }
  else if (trialName == "clockwork")
  {
    trialName = "CLOCKWORK (15)";
  }
  else if (trialName == "pharaoh")
  {
    trialName = "PHARAOH (15)";
  }
  else if (trialName == "paradox")
  {
    trialName = "PARADOX (16)";
  }
  else if (trialName == "inhuman")
  {
    trialName = "INHUMAN (16)";
  }
  else if (trialName == "chemical")
  {
    trialName = "CHEMICAL (17)";
  }
  else if (trialName == "origin")
  {
    trialName = "ORIGIN (18)";
  }
  else if (trialName == "origin")
  {
    trialName = "ORIGIN (18)";
  }
  else if (trialName == "mainframe")
  {
    trialName = "MAINFRAME (13)";
  }
  else if (trialName == "countdown")
  {
    trialName = "COUNTDOWN (14)";
  }
  else if (trialName == "heatwave")
  {
    trialName = "HEATWAVE (15)";
  }
  else if (trialName == "snowdrift")
  {
    trialName = "SNOWDRIFT (16)";
  }
  else if (trialName == "ascension")
  {
    trialName = "ASCENSION (17)";
  }
  else if (trialName == "wanderlust")
  {
    trialName = "WANDERLUST (15)";
  }
  else if (trialName == "primal")
  {
    trialName = "PRIMAL (13)";
  }
  else if (trialName == "species")
  {
    trialName = "SPECIES (13)";
  }
  else if (trialName == "upheaval")
  {
    trialName = "UPHEAVAL (14)";
  }
  else if (trialName == "tempest")
  {
    trialName = "TEMPEST (15)";
  }
  else if (trialName == "circadia")
  {
    trialName = "CIRCADIA (16)";
  }
  else if (trialName == "quantum")
  {
    trialName = "QUANTUM (18)";
  }
  else if (trialName == "passport")
  {
    trialName = "PASSPORT (13)";
  }
  else if (trialName == "believe")
  {
    trialName = "BELIEVE (12)";
  }
  else if (trialName == "devotion")
  {
    trialName = "DEVOTION (12)";
  }
  else if (trialName == "spectacle")
  {
    trialName = "SPECTACLE (16)";
  }
  //TODO: Add new trials
  return trialName;
};

function getTopTrialsFromDB(trialname, trialtopnum, callback){

  setTimeout( function(){

    trialname = translateTrialName(trialname);

    var trialTopQuery = "SELECT playerName, trialName, playerRank,playerScore,playerDiff,playerUpdateDate from playertrialrank where trialName = '"+trialname+"' order by playerScore desc limit " + trialtopnum;
    connection.query(trialTopQuery, function (error, results) {
      if (error) throw error;
      callback(null,results)

    });
    
}, 25);

}

function getTopTrialSequence(trialname,limit,req,res)
{
  connection = mysql.createConnection({
    host     : process.env.MYSQLHOST,
    user     : process.env.MYSQLUSER,
    password : process.env.MYSQLPW,
    database : process.env.MYSQLPLAYERDB
  });
  connection.connect();

  var toptrials = wait.for(getTopTrialsFromDB,trialname,limit);
  wait.for(sendTheBoy,res,toptrials);
};


//check for needed activity
var life4actionTime = function()
{

    console.log('App is running!!!');

}


life4actionTime();
