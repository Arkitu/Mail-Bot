import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig.js';
import { MessageEmbed, MessageActionRow, MessageButton } from 'discord.js';

const db = new JsonDB(new Config("db", true, true, '/'));
const config = new JsonDB(new Config("config", true, true, '/'));

export class Mail {
    constructor(title, content, author, timestamp, client) {
        this.title = title;
        this.content = content;
        this.author = author;
        this.timestamp = timestamp;
        this.client = client;
    }

    get toJSON() {
        return {
            title: this.title,
            content: this.content,
            author: this.author.toJSON,
            timestamp: this.timestamp
        }
    }

    async send(receiver) {
        db.push(`${receiver.path}/mailbox[]`, {
            title: this.title,
            content: this.content,
            author: this.author.simplified_toJSON,
            timestamp: this.timestamp
        });

        // Notify the receiver with an embed with a button to read the mail
        const embed = new MessageEmbed()
            .setColor(config.getData("/main_color"))
            .setTitle(`🔔 Nouveau mail de ${this.author.name}`);
        const components = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("read")
                    .setLabel("Ouvrir")
                    .setStyle("PRIMARY")
            );
        const msg = await receiver.discord.send({ embeds: [embed], components: [components] });
        this.client.on("interactionCreate", async button_interaction => {
            if (button_interaction.message.id != msg.id) return;
            if (button_interaction.customId != "read") return;
            const mail_embed = new MessageEmbed()
                .setColor(config.getData("/main_color"))
                .setTitle(this.title)
                .setDescription(this.content)
                .setFooter({ text: `Envoyé par ${this.author.name} le ${new Date(this.timestamp).toLocaleDateString()} à ${new Date(this.timestamp).getHours()}/${new Date(this.timestamp).getMinutes()}`, iconURL: this.author.avatarURL });
            msg.edit({ embeds: [mail_embed], components: [] });
        })
    }
}