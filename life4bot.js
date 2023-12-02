//LIFE4 MESSENGER - PART OF DDR BOT
//Refer to the README.md for more details about functionality
//Created by Steve Sefchick for use by the LIFE4 Admin Team - 2020-2023

//debug variables
var isDebug = true;

const fs = require('fs');
var config = require('./config.js');
var Discord = require('discord.js');
var mysql = require('mysql');
require('dotenv').config();
const express = require('express');
const { constants } = require('buffer');
const { resolve } = require('path');

var bot = new Discord.Client();
var guild = Discord.GuildMemberManager;
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

    //SET ROLE
    if(msg.includes(bot.user.toString()) && msg.includes('role')) {

      if (message.channel.id === '596168285477666832')
      {
        const role = GetRole(message);
      }

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
        const status_update = ChangeStatus(message,"ON");
      }
      
    }

    //TURN OFF
    if(msg.includes(bot.user.toString()) && msg.includes('turn off')) {

      if (message.channel.id === '596168285477666832')
      {
        const status_update = ChangeStatus(message,"OFF");
      }
    }

});


//Gets username based on UserID
function GetDiscordUsername(user_id)
{
  return new Promise((resolve) => {
    setTimeout(() => {
      //const user_name = bot.users.cache.find(u => u.id === '275626417629298691')
      const user_name = bot.users.cache.find(u => u.id === user_id)
      console.log(user_name.username + " found!");
      resolve(user_name.username);
    });
  });

};


//Gets UserID based on username
function GetDiscordUserID()
{
  return new Promise((resolve) => {
    setTimeout(() => {
      const userid = bot.users.cache.find(u => u.username === 'stevesef')
      console.log(userid.id);
      resolve(userid.id);
    });
  });

};

//send a discord message based on the status of the bot
function discordSendStatusMessage(message,app_status)
{
  return new Promise((resolve) => {
    setTimeout(() => {

      if (isDebug==true)
      {
        console.log("Discord Send Message for " + app_status + "!");
        messagetext = "Hello <@275626417629298691>";
        message.reply(messagetext);
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

//Query the database and retrieve db user_id based on discord username
function GetUserIdBasedOnDiscordUsername(username){

  return new Promise((resolve) => {
    setTimeout(() => {

      if (isDebug==true)
      {
        console.log("We did it fam");
        resolve("Debug userid!");
      }
      else
      {
        var appStatus = "select user_id from wp_kikf_usermeta where meta_key='discord_handle' where meta_value='"+username+"'";
        connection.query(appStatus, function (error, results) {
          if (error) throw error;
          console.log("user_id retrieved from db!");
          resolve(results);
    
        });
      }
    });
  }, 1000);

}

//Query the database and retrieve rank based on user_id
function GetRankBasedOnUserID(user_id)
{
  return new Promise((resolve) => {
    setTimeout(() => {

      if (isDebug==true)
      {
        console.log("We got a dang rank");
        resolve("Debug rank!");
      }
      else
      {
        var appStatus = "select meta_value from wp_kikf_usermeta where meta_key='rank' where user_id="+user_id;
        connection.query(appStatus, function (error, results) {
          if (error) throw error;
          console.log("rank retrieved from db!");
          resolve(results);
    
        });
      }


    });
  }, 1000);
};

//Substring function for rank
function GetSpecificRankString(rank)
{
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(rank.substring(0, rank.indexOf(" ")));
    });
  }, 100);
}

function getSubmissionCount(){

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

//make a change to the status of the bot
function changeAppStatus(status,callback){

  return new Promise((resolve) => {


    setTimeout( function(){

      if (isDebug==true)
      {
        console.log("Change Status to " + status);
        resolve("status changed");
      }
      else
      {
        var appStatus = "UPDATE life4controls set varValue = '"+status+"' where varName='appStatus'";
        connection.query(appStatus, function (error, results) {
          if (error) throw error;
          resolve(results);
          callback(null,results);

        });
      }
      
    }, 1000);
  });

}

//send a discord message once the submission counts have been sent
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


//send a discord update message once the status has been changed
function discordSendStatusChangeMessage(message,status,callback)
{

  return new Promise((resolve) => {

    setTimeout( function(){

      if (isDebug==true)
      {
          console.log("The bot has been updated!");
          resolve("updated");
      }
      else
      {
          var messagetext = "";

          if (status == "ON")
          {
            messagetext = "The bot has been enabled and will now look for newly approved forms!";
          }
          else if (status == "OFF")
          {
            messagetext = "The bot has been deactivated! ";
          }

          message.reply(messagetext);
          resolve(messagetext);
    }

  }, 750);

  });

}

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

//CHANGE STATUS
async function ChangeStatus(message,status_type)
{
  //make connection
  connection = await GetConnection();
  //run query
  const status_update = await changeAppStatus(status_type);
  //report out to discord
  const announce = await discordSendStatusChangeMessage(message,status_type);

}

//UPDATE ROLE
async function GetRole(message,discord_user_id)
{

  //make connection
  connection = await GetConnection();

  //translate userid to username
  var username = await GetDiscordUsername(discord_user_id);

  //lookup user_id based on username
  var user_id =await GetUserIdBasedOnDiscordUsername(username);

  //lookup rank based on db user_id
  var rank = await GetRankBasedOnUserID(user_id);

  //trim rank
  var rank_detailed = await GetSpecificRankString(rank);

  //translate rank to discord role

  //apply role

  //announce message

};

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

life4actionTime();