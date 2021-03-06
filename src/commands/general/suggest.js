// Command Developed with the help of Akashic Bearer#2305
const { MessageEmbed, WebhookClient } = require("discord.js");
const { Command } = require("../../groups/Command");

module.exports = class SuggestCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Sends a suggestion",
			usage: "Suggestion",
			example: "more nsfw commands"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message, args) {
		if (args.length === 0) return message.channel.send("You can't send an empty suggestion.");
		const embed = new MessageEmbed()
			.setDescription(args.join(" "))
			.setFooter(`User: ${message.author.tag} [ID: ${message.author.id}]\nChannel: #${message.channel.name} [ID: ${message.channel.id}]\nServer: ${message.guild.name} [ID: ${message.guild.id}]`);
		new WebhookClient("685901108262076565", "Qy3jDeK9uUO3bIqpYgkZ6MrkspZ9m5H8T6r2IjxWITAiEtNlpFUuaJz-snayg8bXUJWy").send({
			username: message.author.username,
			avatarURL: message.author.displayAvatarURL(),
			embeds: [embed]
		}).then(() => {
			message.channel.send("Your suggestion has been sent to the main server!");
		});
		return true;
	}
};
