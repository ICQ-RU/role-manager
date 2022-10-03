import { Client, Collection, GatewayIntentBits } from 'discord.js';
import * as dotenv from 'dotenv';
import coms from './commands.js'

// Initialization
dotenv.config();
const bot = new Client({ intents: [GatewayIntentBits.Guilds] });

bot.once('ready', () => {
    console.log('Bot started!');
});

// Collection of bot commands
bot.commands = new Collection();

// Asynchronous function, executed by the commands
async function exec(interaction) {
    const role = coms[interaction.commandName];
    if (interaction.member.roles.cache.has(role)) { // If member has the role with ID listed in 'commands.js'
        await interaction.member.roles.remove(role) // We remove this role from them
        await interaction.reply(`You were stripped of the role ${interaction.guild.roles.cache.get(role).name}`) // Reply them
        console.log(`${interaction.user.username} was stripped of the role ${interaction.guild.roles.cache.get(role).name}`) // Log it
    } else {
        await interaction.member.roles.add(role) // We add this role to them
        await interaction.reply(`You've been assigned the role ${interaction.guild.roles.cache.get(role).name}`)
        console.log(`${interaction.user.username} was assigned the role ${interaction.guild.roles.cache.get(role).name}`)
    }
}

// Command initialization cycle gets all commands from 'commands.js' and adds it to Collection along with the 'exec()' function
for (var com in coms) {
    bot.commands.set(com, exec);
};

// Event handler
bot.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const execute = bot.commands.get(interaction.commandName); // Gets a function that matches command name from 'bot.commands' Collection

	if (!execute) return;

	try {
		await execute(interaction); // Executes the function with given parameter
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'An error occured while executing this command!', ephemeral: true });
	}
});

member
