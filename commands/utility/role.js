const { SlashCommandBuilder } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('role')
		.setDescription('Assigns an appropriate role based on your LIFE4 rank'),
	async execute(interaction) {
		await interaction.reply('role test');
	},
};
