const { SlashCommandBuilder } = require('discord.js');

/*
function testfunc(){

    return new Promise((resolve) => {

        setTimeout( function(){
            resolve("ayo");
        }, 250);
    });
};
*/

module.exports = {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Replies with the status of the LIFE4 bot. Primarily for admin use.'),
	async execute(interaction) {
        //var test_var = await testfunc();
        //console.log(test_var);
		await interaction.reply('test');
	},
};
