exports = async (argument, guild) => {
    var id = argument.slice(1, argument.length - 1)
    if (id.startsWith('!')) id = id.slice(1)
    var user = guild.members.cache.find(m => m.id === id)
    if (!user) return 'The member you mentioned is either invalid or isn\'t in this server!'
    else return user
}