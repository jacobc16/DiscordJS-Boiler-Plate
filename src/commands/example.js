const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');

// Setup slash command here
const data = new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Ping the bot');

// Function to execute when command is called
const execute = async (client, interaction) => {
	const row = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setCustomId('delete')
				.setLabel('Delete Me')
				.setStyle('DANGER'),
		);
	await interaction.reply({ content: "Pong!", components: [row] });
};

// Setup interaction functions to execute when an interaction has been called
const interactions = {
	// Called when the delete button is pressed
	"delete": async (client, interaction) => {
		await interaction.message.delete();
	}
}

module.exports = {
	data, // Export the slash command
	execute, // Export the function called when slash command is used
	interactions // Optional: Export interaction functions
};
