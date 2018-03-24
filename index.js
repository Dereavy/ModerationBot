"use strict";

/* DEPENDENCIES */
const util = require('util');
const request = require("request")
const Discord = require("discord.js");
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');


/* Load configuration */
try {
    var filename = "./config.yml";
    var contents = fs.readFileSync(filename, 'utf8');
    var config = yaml.load(contents);
    //console.log(util.inspect(data, false, 10, true));
} catch (err) {
    //console.log(err.stack || String(err));
}

const bot = new Discord.Client();
bot.login(config.botToken);


bot.on('ready', () => {
    bot.user.setActivity('with fire...');
    console.log("[Bot Active]");

    // Create log channel for bot to log moderation actions to.

    var server = bot.guilds.get(config.serverID);
    var logChannel = server.channels.find("name", config.modLogChannel);

    if (!server.channels.exists("name", config.modLogChannel)) {

        server.createChannel(config.modLogChannel, 'text', [{
                id: server.id,
                deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES', 'READ_MESSAGES'],
            }])
            .then(
                console.log("Moderation log channel created")
            )
            .catch();

    }

});

bot.on('messageReactionAdd', (reaction, user) => {});
bot.on('message', (message) => {
    if (message.author.bot) { return; }

    /* date */
    var d = new Date();
    var date = "`" + d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear() + "-`_`" + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + "`_";

    /* command + commandMsg */
    const prefixCheck = message.content.trim().split(/ +/g)[0];
    if (config.prefix == prefixCheck) {
        const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
        const precommand = args[0];
        var command = args.shift().toLowerCase();
        var commandMsg = "";
        for (var i = 0; i < args.length; i++) {
            commandMsg += args[i] + " ";
        }
    } else { var command = "unknown" }
    if (message.channel.type == "dm") { return }

    /** Moderation */
    /** CLEAR MESSAGES OF USER */
    if ((command == "clear") && (message.member.hasPermission("MANAGE_MESSAGES"))) {
        try {
            var amount = Number((commandMsg.trim().split(/ +/g))[0])
            var userA = (commandMsg.trim().split(/ +/g))[1]
            var counter = 0;
            message.delete(1000).catch(O_o => {});
            message.channel.fetchMessages({ limit: 99 }).then(mList => {
                var firstround = mList.find(function(msg) {
                    if (!(msg.author.bot)) {
                        if (counter < amount) {
                            if (msg.author.tag == userA) {
                                msg.delete(1000).catch(O_o => {});
                                counter++;
                                if (counter == amount) {
                                    ((bot.guilds.get(config.serverID)).channels.find("name", config.modLogChannel)).send({
                                        "embed": {
                                            "description": message.author.tag + " cleared " + amount + " messages from " + msg.author.tag + "\nChannel: " + msg.channel.name,
                                            "color": 0xe0e0e0,
                                            "timestamp": new Date(),
                                            "footer": {
                                                "icon_url": message.member.icon_url,
                                                "text": "  Date cleared:"
                                            }
                                        }
                                    });
                                }
                            } else {}
                        }
                    }
                    if (counter >= amount) { return false; }
                });
            });
        } catch (error) {
            console.log(error)
            message.author.send(config.prefix + " clear **<number>** **<user>**");
        }

    }

    /** WARN USER */
    if ((command == "warn") && (message.member.hasPermission("MANAGE_MESSAGES"))) {
        message.delete(1000).catch(O_o => {});
        var userA = (commandMsg.trim().split(/ +/g))[0];
        var reason = commandMsg.slice(userA.length);

        if (!(bot.users.find('tag', userA)).bot) {
            ((bot.guilds.get(config.serverID)).channels.find("name", config.modLogChannel)).send({
                "embed": {
                    "description": "**" + message.author.tag + " warned " + userA + "**\n Reason: ```" + reason + "```\nChannel: " + message.channel.name,
                    "color": 0xFFA500,
                    "timestamp": new Date(),
                    "footer": {
                        "icon_url": message.member.icon_url,
                        "text": "  Date warned:"
                    }
                }
            });
            (bot.users.find('tag', userA)).send({
                "embed": {
                    "description": "**You have been warned: **\n" + message.author.tag + " warned you: ```" + reason + "```\nChannel: " + message.channel.name,
                    "color": 0xff0000,
                    "timestamp": new Date(),
                    "footer": {
                        "icon_url": message.member.icon_url,
                        "text": "  Date warned:"
                    }
                }
            });
        }
    }

});