const { SlashCommandBuilder } = require('discord.js');
var connection_test = require('../../connection.js');


//channel id's
const admin_bot_channel = '596168285477666832';
const early_access_channel = '537545868975538208';


/*
function testfunc(){

    return new Promise((resolve) => {

        setTimeout( function(){
            resolve("ayo");
        }, 250);
    });
};
*/

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
          connection_test.query(appStatus, function (error, results) {
            if (error) throw error;
            console.log("status retrieved from DB!");
            resolve(results);
            return results;
      
          });
        }
      });
    }, 5000);
  
  }

//GET STATUS
async function GetStatus()
{
  //make connection
  //connection = await GetConnection();
  //run query
  const app_status = await getAppStatusFromDB();
  //announce message
  const announce = await discordSendStatusMessage(message,app_status);
};

//send a discord message based on the status of the bot
function discordSendStatusMessage(app_status)
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
            messagetext = "Status is currently " + app_status +"! The bot is running and looking for approved forms! Huzzah!";
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

module.exports = {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Replies with the status of the LIFE4 bot. Primarily for admin use.'),
	async execute(interaction) {
        var get_status = await GetStatus();
        console.log(get_status);
		await interaction.reply('test');
	},
};
