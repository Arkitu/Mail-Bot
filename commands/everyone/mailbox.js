import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';
import { User } from '../../lib/user.js';
import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig.js';

var config = new JsonDB(new Config("config", true, true, "/"));

// Discord command that show the mailbox of the user
export const data = new SlashCommandBuilder()
	.setName('mailbox')
	.setDescription('Affiche la boite aux lettres');
export async function execute(interaction) {
	const user = new User(interaction.user.id, interaction.client);

	// Reply the mailbox of the user with an embed and a selection menu to choose the mail to read
	await interaction.reply({ embeds: [user.mailbox_embed], components: [user.mailbox_components]});
	const msg = await interaction.fetchReply();
	interaction.client.on('interactionCreate', async menu_interaction => {
		if (!menu_interaction.isSelectMenu()) return;
		if (menu_interaction.message.id != msg.id) return;
		let mail = user.mailbox[menu_interaction.values[0]];
		const mail_embed = new MessageEmbed()
			.setColor(config.getData("/main_color"))
			.setTitle(mail.title)
			.setDescription(mail.content)
			.setFooter({ text: `Envoyé par ${mail.author.name} le ${new Date(mail.timestamp).toLocaleDateString()} à ${new Date(mail.timestamp).getHours()}:${new Date(mail.timestamp).getMinutes()}`, iconURL: mail.author.avatarURL });
		menu_interaction.update({ embeds: [mail_embed], components: [] });
	});
}