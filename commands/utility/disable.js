const { SlashCommandBuilder } = require('discord.js');

//channel id's
const admin_bot_channel = '596168285477666832';
const early_access_channel = '537545868975538208';

//debug variables
var debugFlags = require('../../feature_flags.js');
var isDebug = debugFlags.isDebugMode;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('disable')
		.setDescription('Disables the LIFE4 bot'),
	async execute(interaction) {
		await interaction.reply('disable test');
	},
};
