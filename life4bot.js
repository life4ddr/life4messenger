//LIFE4 MESSENGER - PART OF DDR BOT
//Refer to the README.md for more details about functionality
//Created by Steve Sefchick for use by the LIFE4 Admin Team - 2020-2023

//debug variables
var isDebug = true;

const fs = require('fs');
var config = require('./config.js');
var Discord = require('discord.js');
//var wait = require('wait.for');
var mysql = require('mysql');
require('dotenv').config();
const express = require('express');
const { constants } = require('buffer');
const { resolve } = require('path');

var bot = new Discord.Client();
bot.login(process.env.DISCORD_BOT_TOKEN);

const port = process.env.PORT;
var connection;

const app = express();
app.listen(port, () => console.log(`Listening on port ${port}!`));


//BOT LOG IN
//This runs automatically in order to log in on discord and listen to activity
bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);

  });


//BOT LISTEN FOR MESSAGES
//Listener that reacts to commands when the bot is mentioned
  bot.on('message', (message) => {
    
    let myRole = message.guild.roles.cache.get("530615149531365393");
    
    var msg = message.content;
    if (msg.startsWith('<@!')) {
			msg = msg.replace('!','');
		}

    //GET COMMANDS
    if(msg.includes(bot.user.toString()) && msg.includes('commands')) {
        message.reply('Here are my commands!\nturn on - enable the bot, which will look for new "approved" forms every 10 minutes\nget submissions - get all submissions ready to be reviewed\n status = get status \n check queue - no longer used \n check players - no longer used \n check trials - no longer used \n rr qual - starts the sync job for Rank Royale qualifiers \n rr sync - starts the sync job for the Rank Royale competition across spreadsheets \n rr announce - Does any Rank Royale related announcements \n turn off = disable the bot');
    }
    
    //GET STATUS
    if(msg.includes(bot.user.toString()) && msg.includes('status')) {

      if (message.channel.id === '596168285477666832')
      {
        const status = GetStatus(message);
      }

    }

    //GET NUMBER OF NEW SUBMISSIONS IN QUEUE
    if(msg.includes(bot.user.toString()) && msg.includes('get submissions')) {
      if (message.channel.id === '596168285477666832')
      {
        const submissions = GetSubmissions(message);
      }
    }

    //TURN ON
    if(msg.includes(bot.user.toString()) && msg.includes('turn on')) {

      if (message.channel.id === '596168285477666832')
      {
        //wait.launchFiber(changeAppStatusSequenceDiscord,message,"ON");

      }
      
    }

    //TURN OFF
    if(msg.includes(bot.user.toString()) && msg.includes('turn off')) {

      if (message.channel.id === '596168285477666832')
      {
        //wait.launchFiber(changeAppStatusSequenceDiscord,message,"OFF");

      }
    }

    //CHECK QUEUE
    if(msg.includes(bot.user.toString()) && msg.includes('check queue')) {

      if (message.channel.id === '596168285477666832')
      {
        //wait.launchFiber(changeAppStatusSequenceDiscord,message,"QUEUE");

      }
    }

    //CHECK PLAYERS
    if(msg.includes(bot.user.toString()) && msg.includes('check players')) {

      if (message.channel.id === '596168285477666832')
      {
        //wait.launchFiber(changeAppStatusSequenceDiscord,message,"PLAYERS");

      }
    }


    //CHECK TRIALS
    if(msg.includes(bot.user.toString()) && msg.includes('check trials')) {

      if (message.channel.id === '596168285477666832')
      {
        //wait.launchFiber(changeAppStatusSequenceDiscord,message,"TRIALS");

      }
    }

    //TOURNEY SYNC 
    if(msg.includes(bot.user.toString()) && msg.includes('rr sync')) {

      if (message.channel.id === '596168285477666832')
      {
        //wait.launchFiber(changeAppStatusSequenceDiscord,message,"TOURNEYSYNC");

      }
    }

    //TOURNEY QUALIFIER SYNC
    if(msg.includes(bot.user.toString()) && msg.includes('rr qual')) {

      if (message.channel.id === '596168285477666832')
      {
        //wait.launchFiber(changeAppStatusSequenceDiscord,message,"TOURNEYQUALSYNC");

      }
    }

      //TOURNEY ANNOUNCE 
      if(msg.includes(bot.user.toString()) && msg.includes('rr announce')) {

        if (message.channel.id === '596168285477666832')
        {
          //wait.launchFiber(changeAppStatusSequenceDiscord,message,"TOURNEYANNOUNCE");
  
        }
      }

});














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

function discordSendStatusMessage(message,app_status)
{
  return new Promise((resolve) => {
    setTimeout(() => {

      if (isDebug==true)
      {
        console.log("Discord Send Message for " + app_status + "!");
        resolve("message sent !");
      }
      else
      {
          var messagetext = "";

          if (app_status == "ON")
          {
            messagetext = "Status is currently " + app_status +"! The bot is running and looking for approved forms!";
          }
          else if (app_status == "OFF")
          {
            messagetext = "Status is currently " + app_status +"! The bot is not running!";
          }
          else if (app_status == "QUEUE")
          {
            messagetext = "Status is currently " + app_status +"! This status is no longer used!";
          }
          else if (app_status == "PLAYERS")
          {
            messagetext = "Status is currently " + app_status +"! This status is no longer used!";
          }
          else if (app_status == "TRIALS")
          {
            messagetext = "Status is currently " + app_status +"! This status is no longer used!";
          }
          else if (app_status == "TOURNEYSYNC")
          {
            messagetext = "Status is currently " + app_status +"! The bot is syncing the spreadsheets";
          }
          else if (app_status == "TOURNEYANNOUNCE")
          {
            messagetext = "Status is currently " + app_status +"! The bot is going to announce tournament scores ";
          }
          else if (app_status == "ERROR")
          {
            messagetext = "Status is currently " + app_status +"! Uh oh! Tell my Dad!";
          }


          message.reply(messagetext);
          resolve(messagetext);
    }

    });
  }, 5000);

}

//Query the database and retrieve the status
function getAppStatusFromDB(){

  return new Promise((resolve) => {
    setTimeout(() => {

      if (isDebug==true)
      {
        console.log("Get Status from DB!");
        resolve("Debug Status!");
      }
      else
      {
        var appStatus = "SELECT varValue from life4controls where varName='appStatus'";
        connection.query(appStatus, function (error, results) {
          if (error) throw error;
          console.log("status retrieved from DB!");
          resolve(results);
          return results;
    
        });
      }
    });
  }, 5000);

}

function getSubmissionCount(callback){

  return new Promise((resolve) => {
  setTimeout( function(){

      if (isDebug==true)
      {
        console.log("Get Submission Count!");
        resolve("Debug Count");
      }
      else
      {
          var appStatus = "select COUNT(*) as 'subcount' from wp_kikf_postmeta where meta_key='state' and meta_value='submitted'";
          connection.query(appStatus, function (error, results) {
            if (error) throw error;
            resolve(result);
            callback(null,results);

          });
      }
      
  }, 5000);

  });

}

function updatedSubmissionToReported(callback){

  return new Promise((resolve) => {

        setTimeout( function(){

          if (isDebug==true)
          {
        
            console.log("Submission Count Updated");
            resolve("Submission count updated");
          }
          else
          {
            console.log("updating");
            var appStatus = "update wp_kikf_postmeta set meta_value='submission_reported' where meta_key='state' and meta_value='submitted'";
            connection.query(appStatus, function (error, results) {
              if (error) throw error;
              console.log("gonna update");
              resolve(results);
              callback(null,results)
        
            });
          }

          
      }, 2500);

  });

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
  //wait.launchFiber(changeAppStatusSequence, value,req,res);
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
  return new Promise((resolve) => {

        setTimeout( function(){

          if (isDebug==true)
          {
              console.log("Discord Send Submission Count Message");
              resolve("discord send status message");
          }
          else
          {
              var messagetext = "There are " + countofgoods + " in the form queue ready to be reviewed!";
              message.reply(messagetext);
              resolve(messagetext);
          }

      }, 750);
  });
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
  //wait.for(sendTheBoy,res,currentStatus);
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
    
  }

  console.log("Updating status!");
  var currentStatus = wait.for(changeAppStatus,status);
  //wait.for(discordSendStatusChangeMessage,message,status);
};




//
// GET ALL PLAYERS
//

//API
app.get("/api/players/all", function(req, res) {
   
  //wait.launchFiber(getAllPlayersSequence,req,res);

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

  console.log("Time for test!");
  var allplayers = wait.for(getAllPlayersfromDB);
  //wait.for(sendTheBoy,res,allplayers);
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
  //wait.launchFiber(getSinglePlayerSequence, name, req,res);
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
  //wait.for(sendTheBoy,res,oneplayer);
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
    //wait.launchFiber(getTopTrialSequence, trialname,limit, req,res);
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

  var toptrials = wait.for(getTopTrialsFromDB,trialname,limit);
  //wait.for(sendTheBoy,res,toptrials);
};


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
        connection = mysql.createConnection({
          host     : process.env.MYSQLHOST,
          user     : process.env.MYSQLUSER,
          password : process.env.MYSQLPW,
          database : process.env.MYSQLPLAYERDB
        });
        connection.connect();
        resolve(connection);
      }

    }, 5000);

});
};




//
//ASYNC FUNCTION ZONE
//



//GET STATUS
async function GetStatus(message)
{
  //make connection
  connection = await GetConnection();
  //run query
  const app_status = await getAppStatusFromDB();
  //announce message
  const announce = await discordSendStatusMessage(message,app_status);
};

//GET SUBMISSIONS
async function GetSubmissions(message)
{
  //make connection
  connection = await GetConnection();
  //get submission count
  const submission_count = await getSubmissionCount();
  //update state
  const submission_get_update = await updatedSubmissionToReported();
  //report out to discord
  const discord_send_submission_message = await discordSendSubmissionMessage(message,submission_count[0].subcount);
}



//check for needed activity
async function life4actionTime()
{
    //console.log('Making database connection...');
    console.log(await GetConnection());
    //console.log('Connection made!');
    console.log('App is running!!!');
}

GetSubmissions();

//life4actionTime();
//HellAss2();