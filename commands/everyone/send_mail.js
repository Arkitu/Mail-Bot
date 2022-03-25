import { SlashCommandBuilder } from "@discordjs/builders";
import { User } from "../../lib/user.js";
import { Mail } from "../../lib/mail.js";
import { MessageEmbed } from "discord.js";
import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig.js'

// Get config
const config = new JsonDB(new Config("config", true, true, "/"));

export const data = new SlashCommandBuilder()
    .setName("send_mail")
    .setDescription("Envoie un message à un utilisateur")
    .addUserOption(option => option
        .setName("receiver")
        .setRequired(true)
        .setDescription("L'utilisateur à qui envoyer le message")
    )
    .addStringOption(option => option
        .setName("title")
        .setRequired(true)
        .setDescription("Le titre du mail")
    )
    .addStringOption(option => option
        .setName("content")
        .setRequired(true)
        .setDescription("Le contenu du mail")
    );
export async function execute(interaction) {
    // Get the options
    const opt_receiver = new User(interaction.options.getUser("receiver").id, interaction.client);
    const opt_title = interaction.options.getString("title");
    const opt_content = interaction.options.getString("content");
    const author = interaction.user;

    // Create the mail
    const mail = new Mail(opt_title, opt_content, new User(author.id, interaction.client), Date.now(), interaction.client);

    // Send the mail
    mail.send(opt_receiver);

    // Reply to the sender with an embed
    const embed = new MessageEmbed()
        .setColor(config.getData("/main_color"))
        .setTitle("Message envoyé")
        .setDescription("Aperçu :")
        .addField(mail.title, mail.content);
    interaction.reply({ embeds: [embed] });
}