import { SlashCommandBuilder } from '@discordjs/builders';
import { User } from '../../lib/user.js';

// Discord command that show the mail trash of the user
export const data = new SlashCommandBuilder()
	.setName('trash')
	.setDescription('Affiche la corbeille');
export async function execute(interaction) {
	const user = new User(interaction.user);

	// Reply with the mail trash
	interaction.reply({ embeds: [user.trash_embed] });
}