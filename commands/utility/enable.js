const { SlashCommandBuilder } = require('discord.js');

//channel id's
const admin_bot_channel = '596168285477666832';
const early_access_channel = '537545868975538208';

//debug variables
var debugFlags = require('../.flags.js');
var isDebug = debugFlags.isDebugMode;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('enable')
		.setDescription('Enables the automatic LIFE4 bot in the event that it was disabled'),
	async execute(interaction) {
		await interaction.reply('enable test');
	},
};
