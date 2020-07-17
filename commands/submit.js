exports.config = {
    name: "submit",
    description: "A command that will help you with submitting assignments.",
    usage: "submit",
    category: "Miscellaneous",
};

exports.run = async (bot, message, args) => {
    var assignmentName = args.join(' ')
    if (!assignmentName) return message.channel.send('Please specify the assignment name!')
    var attachs = message.attachments
    if (!attachs.array()[0]) return message.channel.send('Please attach the notes in this message as assignments!')
    var msg = `<@${message.author.id}> (${message.author.tag}) has submitted the answer(s) for **${assignmentName}**!\n`
    for (let i = 0; i < attachs.array().length; i++) {
        msg = msg + attachs.array()[i].url + "\n"
    };

    for (let user of message.guild.members.cache.array()) {
        try { user.send(msg) }
        catch { err => { if (err) throw err } }
    }
};