exports.config = {
    name: "say",
    aliases: ["rep", "tell"],
    cooldown: 10,
    guildOnly: true,
    description: "A command that will make me say a message or an embed on behalf of you.",
    usage: "say <Message / Embed>",
    category: "Miscellaneous",
};

exports.run = async (_, message, args) => {
    var cont
    message.delete()
    if (args[0].startsWith('{"embed":')) cont = JSON.parse(args.join(' ').replace(/'/g, "\""));
    else cont = args.join(' ');
    message.channel.send(cont);
};
