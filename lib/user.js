import { MessageEmbed } from "discord.js";
import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig.js';

const db = new JsonDB(new Config("db", true, true, '/'));
const config = new JsonDB(new Config("config", true, true, '/'));

export class User {
    constructor(discord_user) {
        this.discord = discord_user;
        if (db.getIndex("/users", discord_user.id) === -1) {
            db.push("/users[]", {
                id: discord_user.id,
                name: discord_user.username,
                mailbox: [],
                archives: [],
                trash: []
            });
        }
        db.push(`${this.path}/name`, discord_user.username);
    }

    get path() {
        db.reload();
        return `/users[${db.getIndex("/users", this.discord.id)}]`;
    }

    get mailbox() {
        return db.getData(`${this.path}/mailbox`);
    }

    get archives() {
        return db.getData(`${this.path}/archives`);
    }

    get trash() {
        return db.getData(`${this.path}/trash`);
    }

    get name() {
        return db.getData(`${this.path}/name`);
    }

    get id() {
        return db.getData(`${this.path}/id`);
    }

    get mailbox_embed() {
        const embed = new MessageEmbed()
		    .setColor(config.getData("/main_color"))
		    .setTitle(`Boîte aux lettres de ${this.name}`)
        for (let mail of this.mailbox) {
            let date = new Date(parseInt(mail.timestamp));
            if (!mail.readed) {
                embed.addField(`:envelope_with_arrow: ${mail.title}`, `Envoyé par ${mail.author.name} le ${date.getDay()}/${date.getMonth()}/${date.getFullYear()} à ${date.getHours()}:${date.getMinutes()}`);
            } else {
                embed.addField(`:envelope: ${mail.title}`, `Envoyé par ${mail.author.name} le ${date.getDay()}/${date.getMonth()}/${date.getFullYear()} à ${date.getHours()}:${date.getMinutes()}`);
            }
        }
        return embed;
    }

    get archives_embed() {
        const embed = new MessageEmbed()
		    .setColor(config.getData("/main_color"))
		    .setTitle(`Archives de ${this.name}`)
        for (let mail of this.archives) {
            let date = new Date(parseInt(mail.timestamp));
            if (!mail.readed) {
                embed.addField(`:envelope_with_arrow: ${mail.title}`, `Envoyé par ${mail.author.name} le ${date.getDay()}/${date.getMonth()}/${date.getFullYear()} à ${date.getHours()}:${date.getMinutes()}`);
            } else {
                embed.addField(`:envelope: ${mail.title}`, `Envoyé par ${mail.author.name} le ${date.getDay()}/${date.getMonth()}/${date.getFullYear()} à ${date.getHours()}:${date.getMinutes()}`);
            }
        }
        return embed;
    }

    get trash_embed() {
        const embed = new MessageEmbed()
		    .setColor(config.getData("/main_color"))
		    .setTitle(`Corbeille de ${this.name}`)
        for (let mail of this.trash) {
            let date = new Date(parseInt(mail.timestamp));
            if (!mail.readed) {
                embed.addField(`:envelope_with_arrow: ${mail.title}`, `Envoyé par ${mail.author.name} le ${date.getDay()}/${date.getMonth()}/${date.getFullYear()} à ${date.getHours()}:${date.getMinutes()}`);
            } else {
                embed.addField(`:envelope: ${mail.title}`, `Envoyé par ${mail.author.name} le ${date.getDay()}/${date.getMonth()}/${date.getFullYear()} à ${date.getHours()}:${date.getMinutes()}`);
            }
        }
        return embed;
    }
}