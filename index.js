import { Client, Collection, GatewayIntentBits } from 'discord.js';
import * as dotenv from 'dotenv';
import coms from './commands.js'

dotenv.config();
const bot = new Client({ intents: [GatewayIntentBits.Guilds] });

bot.once('ready', () => {
    console.log('Бот запущен!');
});

bot.commands = new Collection();

async function exec(interaction) {
    if (interaction.member.roles.cache.has(coms[interaction.commandName])) {
        await interaction.member.roles.remove(coms[interaction.commandName])
        await interaction.reply(`Вы были лишены роли ${interaction.guild.roles.cache.get(coms[interaction.commandName]).name}`)
    } else {
        await interaction.member.roles.add(coms[interaction.commandName])
        await interaction.reply(`Вам была выдана роль ${interaction.guild.roles.cache.get(coms[interaction.commandName]).name}`)
    }
}

for (var com in coms) {
    console.log(`${com}: ${coms[com]}`)
    bot.commands.set(com, exec);
};

bot.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = bot.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});


bot.login(process.env.TOKEN);