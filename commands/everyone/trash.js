import { SlashCommandBuilder } from '@discordjs/builders';
import { User } from '../../lib/user.js';

export const data = new SlashCommandBuilder()
	.setName('trash')
	.setDescription('Affiche la corbeille');
export async function execute(interaction) {
	const user = new User(interaction.user);

	interaction.reply({ embeds: [user.trash_embed] });
}