const Discord = require('discord.js');
const fs = require('fs')

const {
    TOKEN,
    PREFIX,
    OWNER,
    STAFF
} = require('./databases/config.json')

var bot = new Discord.Client();
bot.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

function loadCmds() {
    let commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    console.log(`${commandFiles.length} commands found.`)
    for (let file of commandFiles) {
   console.log(`Command ${file} loading...`)
        delete require.cache[require.resolve(`./commands/${file}`)];
        let command = require(`./commands/${file}`);
        bot.commands.set(command.config.name, command);
    };
    console.log(`Done! ${commandFiles.length} commands were successfully loaded!`)
};

bot.on('ready', () => {
    console.log(`${bot.user.username} came online!`);
    bot.user.setPresence({ activity: { name: `${PREFIX}submit | ${bot.users.cache.size} students`}})
    .then(console.log(`Changed the presence of ${bot.user.username} to '${bot.user.presence.activities[0]}'.`))
    .catch(console.error);
});

loadCmds();

bot.on('message', message => {
    
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;

    var msg = message.content;
    var cont = msg.slice(PREFIX.length).split(/ +/);
    var command = cont[0].toLowerCase();
    var args = cont.slice(1);

    if (command === 'jointest') return bot.emit('guildMemberAdd', message.mentions.members.first());

    if (command === 'reload') {
        if (message.author.id === OWNER || STAFF.includes(message.author.id)) {
            if (args[0]) {
                if (!bot.commands.get(args[0].toLowerCase())) return message.channel.send(`Error: ${args[0].toLowerCase()}.js not found.`)
                delete require.cache[require.resolve(`./commands/${args[0].toLowerCase()}.js`)];
                try {
                    var newCommand = require(`./commands/${args[0].toLowerCase()}.js`);
                    bot.commands.set(newCommand.config.name, newCommand);
                } catch (error) {
                    return message.channel.send(`There was an error while reloading the command \`${args[0].toLowerCase()}\`:\n\`${error.message}\``);
                };
                message.channel.send(`Successfully reloaded ${newCommand.config.name}.js!`)
            } else {
                loadCmds()
                message.channel.send(`Successfully reloaded all the commands!`)
            };
        } else {
            var emb = new Discord.MessageEmbed()
                .setTitle(`Error:`)
                .setDescription(`Developer access only.\nAccess denied.`)
                .setColor(`ff0000`)
            return message.channel.send(emb);
        };
    };

    var cmd = bot.commands.get(command) || bot.commands.find(c => c.config.aliases && c.config.aliases.includes(command));
    if (!cmd) return;
    if (cmd.config.guildOnly && message.channel.type !== 'text') {
        return message.reply(`I can't execute the ${cmd.config.name} command inside DMs!`);
    };

    if (!cooldowns.has(cmd.config.name)) {
        cooldowns.set(cmd.config.name, new Discord.Collection());
    };
    var now = Date.now();
    var timestamps = cooldowns.get(cmd.config.name);
    var cooldownAmount = (cmd.config.cooldown || 1) * 1000;
    if (timestamps.has(message.author.id)) {
        var expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) {
            var timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${cmd.config.name}\` command.`);
        };
    };
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    cmd.run(bot, message, args);
});

bot.login(TOKEN);