const origin = require("../../groups/NSFWCommand");
const { Command, Embed } = require("../../groups/multi/NekoslifeSubcategory")(origin);

module.exports = class XLesbianCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Displays a lesbian hentai picture or GIF"
		});
	}

	async run(bot, message) {
		const embed = new Embed(this,
			`${message.author}  LEZ be Honest!`);
		embed.send(message, this.nekoslife.getNSFWLesbian);
	}
};
