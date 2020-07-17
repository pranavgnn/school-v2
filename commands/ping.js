exports.config = {
    name: "ping",
    description: "A command that will mention my current latency and the API's current latency.",
    usage: "ping",
    category: "Miscellaneous",
};

exports.run = async (_, message) => {
    const otn = Math.round((new Date()).getTime());
    const m = await message.channel.send({ embed: { title: 'Ping?', color: '#eb98ff' } });
    const uts = message.createdTimestamp;
    const ntn = Math.abs(otn - uts);
    var embed = {
        embed: {
            title: '🏓 Pong!',
            color: '#eb98ff',
            description: `API Latency: \` ${m.createdTimestamp - message.createdTimestamp}ms \`\nBot Latency: \` ${ntn}ms \``,
        }
    };
    m.edit(embed);
};