const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('commands')
		.setDescription('Replies with LIFE4BOT commands!'),
	async execute(interaction) {
		await interaction.reply('Here are my commands!\nturn on - enable the bot, which will look for new "approved" forms every 10 minutes\nget submissions - get all submissions ready to be reviewed\n status = get status \n check queue - no longer used \n check players - no longer used \n check trials - no longer used \n rr qual - starts the sync job for Rank Royale qualifiers \n rr sync - starts the sync job for the Rank Royale competition across spreadsheets \n rr announce - Does any Rank Royale related announcements \n turn off = disable the bot!');
	},
};
