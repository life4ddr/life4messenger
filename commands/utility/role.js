const { SlashCommandBuilder } = require('discord.js');

//channel id's
const admin_bot_channel = '596168285477666832';
const early_access_channel = '537545868975538208';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('role')
		.setDescription('Assigns an appropriate role based on your LIFE4 rank'),
	async execute(interaction) {
		await interaction.reply('role test');
	},
};
