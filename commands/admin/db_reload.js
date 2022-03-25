import { SlashCommandBuilder } from '@discordjs/builders';
import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig.js';

export const data = new SlashCommandBuilder()
	.setName('db_reload')
	.setDescription('ADMIN: Recharge la base de donnée')
export async function execute(interaction) {
	try {
        // Connect the database
        const db = new JsonDB(new Config("db", true, true, '/'));
        db.reload();
        await interaction.reply("Database reloaded !")
    } catch (error) {
        await interaction.reply(`ERROR: ${error}`);
    }
}