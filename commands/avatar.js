exports.config = {
  name: "avatar",
  aliases: ["guild", "invite", "group"],
  cooldown: 5,
  description:
    "A command that will provide you the invite link of this server.",
  usage: "avatar",
  category: "Fun"
};

const { MessageEmbed } = require("discord.js");
const getUserFromMention = require("../modules/getUserFromMention.js");

exports.run = async (bot, message, args) => {
  var member = message.author.user;
  if (args[0]) member = getUserFromMention(args[0], message.guild);
  var emb = new MessageEmbed()
    .setAuthor(
      bot.user.tag,
      bot.user.avatarURL({ format: "png", dynamic: true, size: 256 })
    )
    .setTitle("Your Avatar")
    .setColor("#eb98ff")
    .setImage(
      message.author.avatarURL({ format: "png", dynamic: true, size: 1024 })
    );
  if (!args[0]) return message.channel.send(emb);
  else {
    emb.setImage(
      member.user.avatarURL({ format: "png", dynamic: true, size: 1024 })
    );
    emb.setTitle(`${member.user.tag}'s Avatar`);
    message.channel.send(emb);
  }
};
