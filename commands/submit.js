const Discord = require("discord.js");
const request = require(`request`);
const fs = require(`fs`);
function prompt(message, time, content) {
  message.channel.send(content).then(() => {
    const filter = m => message.author.id === m.author.id;
    message.channel
      .awaitMessages(filter, {
        time: time * 60 * 1000,
        max: 1,
        errors: ["time"]
      })
      .then(responses => {
        return responses.first();
      })
      .catch(() => {
        message.channel.send(`There was no input. Cancelled prompt.`);
      });
  });
}

exports.config = {
  name: "submit",
  description: "A command that will help you with submitting assignments.",
  usage: "submit",
  category: "Miscellaneous",
  cooldown: 30,
  guildOnly: true
};

exports.run = async (bot, message, args) => {
  var currentAttachs = [];
  var assignmentName = args.join(" ");
  //var test = prompt(message, 300, "Please enter the assignment name.");
  //console.log(test);
  if (!assignmentName)
    return message.channel.send("Please specify the assignment name!");
  var attachs = message.attachments;
  if (!attachs.array()[0])
    return message.channel.send(
      "Please attach the notes in this message as assignments!"
    );
  var msg = await message.channel.send(
    `Submitting the assignment answers to students' Direct Messages... Please wait.`
  );
  for (let i = 0; i < attachs.array().length; i++)
    currentAttachs.push(attachs.array()[i].url);

  message.guild.members.cache.forEach(member => {
    var user = member.user;
    if (!user.bot) {
      user
        .send(
          `**${args.join(" ")}** | By <@${message.author.id}> (${
            message.author.tag
          })`,
          { files: currentAttachs }
        )
        .catch(() => message.channel.send);
      msg.edit(
        `Sending the assignment to ${user.username}'s Direct Messages...'`
      );
    }
  });

  msg.edit(
    `Successfully sent your assignment to all students' Direct Messages.`
  );
};