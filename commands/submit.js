const Discord = require('discord.js')
const request = require(`request`);
const fs = require(`fs`);
const { measureMemory } = require('vm');

exports.config = {
    name: "submit",
    description: "A command that will help you with submitting assignments.",
    usage: "submit",
    category: "Miscellaneous",
};

exports.run = async (bot, message, args) => {
    var currentAttachs = []
    var assignmentName = args.join(' ')
    if (!assignmentName) return message.channel.send('Please specify the assignment name!')
    var attachs = message.attachments
    if (!attachs.array()[0]) return message.channel.send('Please attach the notes in this message as assignments!')
    for (let i = 0; i < attachs.array().length; i++) currentAttachs.push(attachs.array()[i].url)

    for (let user of message.guild.members.cache.array()) {
        user.send(`**${args.join(" ")}** | By <@${message.author.id}> (${message.author.tag})`,{files: currentAttachs}).catch(console.log)
    }
    
};