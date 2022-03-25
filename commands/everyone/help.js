import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig.js';

// Discord command that list all the commands
export const data = new SlashCommandBuilder()
	.setName("help")
	.setDescription("Renvoie la liste des commandes")
	.addStringOption(option => option
		.setName("categorie")
		.setDescription("La categorie sur laquelle vous voulez des précisions")
		.setRequired(false)
		.addChoice("Classics", "Classics")
		.addChoice("Mail", "Mail")
	);

export async function execute(interaction) {
	const db = new JsonDB(new Config("db", true, true, '/'));
	const config = new JsonDB(new Config("config", true, true, '/'));

	const opt_categorie = interaction.options.getString("categorie");

	let help_embed = new MessageEmbed()
		.setColor(config.getData("/main_color"))
		.setThumbnail(interaction.client.user.avatarURL())
	
	if (opt_categorie) {
		help_embed.setAuthor({ name: opt_categorie, iconURL: interaction.client.user.avatarURL(), url: config.getData("/help_link") });
		for (let cmd of db.getData(`/categories[${db.getIndex("/categories", opt_categorie, "name")}]/commands`)) {
			help_embed.addField(`\`/${cmd}\``, db.getData(`/commands[${db.getIndex("/commands", cmd, "name")}]/description`));
		}
	} else {
		help_embed.setAuthor({ name: "Aide de Mail Bot", iconURL: interaction.client.user.avatarURL(), url: config.getData("/help_link") })
		for (let categorie of db.getData("/categories")) {
			help_embed.addField(categorie.name, `\`/help ${categorie.name}\``, true);
		}
	}

	interaction.reply({ embeds: [help_embed] });
}