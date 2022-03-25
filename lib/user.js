import { MessageEmbed, MessageActionRow, MessageSelectMenu } from "discord.js";
import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig.js';

const db = new JsonDB(new Config("db", true, true, '/'));
const config = new JsonDB(new Config("config", true, true, '/'));

export class User {
    constructor(discord_user_id, client) {
        // Get the user's data
        this.discord = client.users.cache.get(discord_user_id);
        if (db.getIndex("/users", discord_user_id) === -1) {
            db.push("/users[]", {
                id: discord_user_id,
                name: this.discord.username,
                mailbox: [],
                archives: [],
                trash: []
            });
        }
        db.push(`${this.path}/name`, this.discord.username);
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

    get mailbox_components() {
        return new MessageActionRow()
            .addComponents([
                new MessageSelectMenu()
                    .setCustomId("read_mail")
                    .setPlaceholder("Lire Mail")
                    .addOptions(((mailbox) => {
                        // Return an array with one option for each mail
                        let options = [];
                        for (let mail of mailbox) {
                            options.push({
                                label: mail.title,
                                value: mailbox.indexOf(mail).toString()
                            });
                        }
                        return options;
                    })(this.mailbox))
            ]);
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

    get toJSON() {
        return {
            id: this.id,
            name: this.name,
            mailbox: this.mailbox,
            archives: this.archives,
            trash: this.trash
        }
    }

    get simplified_toJSON() {
        return {
            id: this.id,
            name: this.name
        }
    }
}