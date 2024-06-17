const { SlashCommandBuilder } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('disables')
		.setDescription('Disables the LIFE4 bot'),
	async execute(interaction) {
		await interaction.reply('disable test');
	},
};
