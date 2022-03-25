import { SlashCommandBuilder } from '@discordjs/builders';
import { User } from '../../lib/user.js';

export const data = new SlashCommandBuilder()
	.setName('archives')
	.setDescription('Affiche les archives');
export async function execute(interaction) {
	const user = new User(interaction.user);

	interaction.reply({ embeds: [user.archives_embed] });
}