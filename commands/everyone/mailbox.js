import { SlashCommandBuilder } from '@discordjs/builders';
import { User } from '../../lib/user.js';

// Discord command that show the mailbox of the user
export const data = new SlashCommandBuilder()
	.setName('mailbox')
	.setDescription('Affiche la boite aux lettres');
export async function execute(interaction) {
	const user = new User(interaction.user);

	// Reply with the mailbox
	interaction.reply({ embeds: [user.mailbox_embed] });
}