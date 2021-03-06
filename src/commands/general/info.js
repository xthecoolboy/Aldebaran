const { MessageEmbed, version } = require("discord.js");
const { Command } = require("../../groups/Command");

module.exports = class InfoCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Displays informations about Aldebaran"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	async run(bot, message) {
		let adminMentions = "";
		for (const [id, member] of Object.entries(bot.config.aldebaranTeam)) {
			if (member.acknowledgements.includes("DEVELOPER")) { adminMentions += `<@${id}>, ${member.text}\n`; }
		}
		const guilds = Number.formatNumber((await bot.shard.fetchClientValues("guilds.cache.size")).reduce((acc, cur) => acc + cur));
		const users = Number.formatNumber((await bot.shard.fetchClientValues("users.cache.size")).reduce((acc, cur) => acc + cur));
		const channels = Number.formatNumber((await bot.shard.fetchClientValues("channels.cache.size")).reduce((acc, cur) => acc + cur));
		const embed = new MessageEmbed()
			.setAuthor(`${bot.user.username} v${bot.version}`, bot.user.avatarURL(), "https://aldebaran.nightorn.com/")
			.addField("Developers of Aldebaran", adminMentions)
			.addField(
				"Statistics",
				`Playing with **${guilds} servers**\nWatching **${channels} channels**\nListening to **${users} users**`,
				true
			)
			.addField(
				"Powered by",
				`VPS Host **Contabo**\nEnvironment **Node.js** ${process.version}\nAPI Library **discord.js** v${version}`,
				true
			)
			.addField(
				"Affiliation",
				"Aldebaran uses but is not affiliated with [DiscordRPG](https://discorddungeons.me), [TheCatAPI](https://thecatapi.com), [Dog API](https://dog.ceo/), [nekos.life](https://nekos.life/), [Giphy](https://giphy.com), [osu!](https://osu.ppy.sh), [Some Random Api](https://some-random-api.ml/) and [Pexels](https://www.pexels.com)."
			)
			.setFooter(`The prefix in this guild is "${message.guild.prefix}".`)
			.setThumbnail(bot.user.avatarURL())
			.setColor(message.guild.me.displayColor);
		message.channel.send({ embed });
	}
};
