const { SlashCommandBuilder } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('enable')
		.setDescription('Enables the automatic LIFE4 bot in the event that it was disabled'),
	async execute(interaction) {
		await interaction.reply('enable test');
	},
};
