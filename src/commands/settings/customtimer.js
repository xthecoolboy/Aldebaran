const { MessageEmbed } = require("discord.js");
const { Command } = require("../../groups/SettingsCommand");
const CustomTimer = require("../../structures/aldebaran/CustomTimer");

module.exports = class CustomTimerCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Manages your custom timers",
			help: "**`&customtimer create`** - Creates a custom timer\n**`&customtimer list`** - Lists your active custom timers\n**`&customtimer delete`** - Deletes the specified custom timer\nThis command allows you to create custom timers. Custom timers are a way for you to be reminded of something every x period of time. For now, this reminder is repeated 10 times; then, it automatically self-destroys. To create a custom timer that reminds you to pet your cat every 5 minutes, use `&customtimer create 5m pet my cat`. If you want to be reminded in the channel in which you are creating the custom timer, add `-c` at the end of the command. If you want to delete the custom timer, use `&customtimer list`, which will give you the list of your active custom timers, look at the ID of the custom timer you want to delete and use `&customtimer delete 60`, if the ID of your custom timer is 60.",
			usage: "Action",
			example: "create",
			aliases: ["ct"]
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message, args) {
		if (args[0] !== undefined) {
			if (args[0].toLowerCase() === "create") {
				if (args.length >= 3) {
					args.shift();
					const times = {
						d: 86400000, h: 3600000, m: 60000, s: 1000
					};
					let timer = args.shift().match(/(\d+\s*[dhms]\b)/ig);
					const channelId = args.includes("-c") ? message.channel.id : null;
					if (channelId !== null) args.splice(args.indexOf("-c"), 1);
					if (timer !== null) {
						timer = timer.reduce((time, str) => time + Number(str.match(/(\d+)\s*([dhms])/i)[1]) * times[RegExp.$2], 0); // Parse the interval
						if (timer < 10000) message.channel.error("WRONG_USAGE", "You cannot set a custom timer with an interval lower than 10 seconds.");
						CustomTimer.create(bot, { // Start the custom timer creation process
							userId: message.author.id,
							timer,
							channelId,
							content: args.join(" ")
						}).then(() => {
							message.channel.send("Your custom timer has been set!");
						}).catch(err => {
							message.channel.error("UNEXPECTED_BEHAVIOR", `An unexpected error occured and your custom timer could not be created.\n> ${err.message}`);
						});
					} else message.reply("the timer timeout is invalid, it needs to be in the following format: `1337d`, d meaning \"day\", being replaced by s for \"seconds\", m for \"minutes\" and h for \"hours\".");
				} else message.reply("you need to specify the timer timeout, its content and if the timer should be shown in the current channel instead of in your DMs (-c)");
			} else if (args[0].toLowerCase() === "delete") {
				const id = parseInt(args[1], 10);
				if (message.author.customTimers.get(id) !== undefined) {
					message.author.customTimers.get(id).delete();
					message.channel.send("The custom timer has successfully been deleted!");
				} else message.reply("we have not found any custom timer with this ID. Check `&customtimer list` to view the custom timers you have set.");
			} else if (args[0].toLowerCase() === "list") {
				if (message.author.customTimers.size === 0) {
					message.reply("you have not set any custom timer.");
				} else {
					let list = "";
					for (const [id, timer] of message.author.customTimers)
						list += `\`[${id}]\` **${timer.content}** every **${timer.timer / 1000}s**\n`;
					const embed = new MessageEmbed()
						.setAuthor(`${message.author.username}  |  Custom Timers List`, message.author.avatarURL())
						.setDescription(`You have **${message.author.customTimers.size} custom timer(s)** set.\n${list}`)
						.setColor(this.color);
					message.channel.send({ embed });
				}
			} else message.reply("this operation is incorrect.");
		} else message.reply("you need to say what you want to do (create / delete / list)!");
	}
};
