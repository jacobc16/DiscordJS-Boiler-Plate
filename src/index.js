const discord = require('discord.js');
const config = require('./data/config.json');
const client = new discord.Client({intents: discord.Intents.FLAGS.GUILDS});
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const cache = require('./cache.js')

client.on('ready', () => {
	console.log(`Bot Online`);
});

client.on('interactionCreate', async interaction => {
	// If command exists execute it
	if (interaction.isCommand() && cache.commands.has(interaction.commandName))
		cache.commands.get(interaction.commandName).execute(client, interaction);

	// If interaction is a button or a select menu execute the function
	if (interaction.isButton() || interaction.isSelectMenu()) {
		cache.commands.forEach(cmd => {
			if(!cmd.hasOwnProperty("interactions")) return;
			if(!cmd.interactions.hasOwnProperty(interaction.customId)) return;

			cmd.interactions[interaction.customId](client, interaction);
		});
	}
});

const fs = require('fs');

const commands = [];
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	cache.commands.set(command.data.name, command);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(config.token);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(config.client_id, config.guild_id),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();


client.login(config.token);