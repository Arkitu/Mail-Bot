import { SlashCommandBuilder } from '@discordjs/builders';

// Discord command that respond pong
export const data = new SlashCommandBuilder()
	.setName('ping')
	.setDescription('Répond pong');
export async function execute(interaction) {
	interaction.reply(':ping_pong: Pong !');
}