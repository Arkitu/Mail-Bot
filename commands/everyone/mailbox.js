import { SlashCommandBuilder } from '@discordjs/builders';
import { User } from '../../lib/user.js';

export const data = new SlashCommandBuilder()
	.setName('mailbox')
	.setDescription('Affiche la boite aux lettres');
export async function execute(interaction) {
	const user = new User(interaction.user);

	interaction.reply({ embeds: [user.mailbox_embed] });
}