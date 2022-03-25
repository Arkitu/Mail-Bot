import { SlashCommandBuilder } from '@discordjs/builders';
import { User } from '../../lib/user.js';

// Discord command that show the mail archives of the user
export const data = new SlashCommandBuilder()
	.setName('archives')
	.setDescription('Affiche les archives');
export async function execute(interaction) {
	const user = new User(interaction.user);

	// Reply with the mail archives
	interaction.reply({ embeds: [user.archives_embed] });
}