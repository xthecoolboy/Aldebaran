<<<<<<< HEAD
exports.run = async (bot, message) => {
	if (message.author.id == `271394014358405121`) require('./../functions/bots/Pollux.js')(bot, message);
	else if (message.author.id == `170915625722576896`) { 
		require(`${process.cwd()}/functions/bots/DiscordRPG.js`)(bot, message);
		require(`${process.cwd()}/functions/timer/DiscordRPG/travel.js`)(bot, message); 
	} else if (!message.author.bot) {
		require(`${process.cwd()}/functions/timer/DiscordRPG/adv.js`)(message); 
		require(`${process.cwd()}/functions/timer/DiscordRPG/sides.js`)(message);
		require(`${process.cwd()}/functions/timer/DiscordRPG/padv.js`)(message);  
	}
	
	if (message.author.bot) return;
	const prefix = process.argv[2] === 'dev' ? process.argv[3] || bot.config.prefix : message.guild.prefix;
	if (message.content.indexOf(prefix) !== 0) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	try {
		bot.commandHandler.execute(command, bot, message, args);
	} catch(err) {
		if (err.message !== 'Unknown Command' && err.message !== 'Exceeded Command Cooldown') throw err;
	}
}
=======
exports.run = async (client, message) => {
  if (message.author.id == `271394014358405121`) require('./../functions/bots/Pollux.js')(client, message);
  else if (message.author.id == `170915625722576896`) { require('./../functions/bots/DiscordRPG.js')(client, message);require(`.//../functions/timer/DRPGTravel.js`)(client, message); }
  else if (message.content === 'kek kek') message.delete();
  else if (!message.author.bot) { require(`./../functions/timer/DRPGAdv.js`)(client,message); require(`.//../functions/timer/DRPGSides.js`)(client, message);require(`.//../functions/timer/padv.js`)(client, message);  }
}

//
>>>>>>> 137f977f43512afcdf8ebd7057b230c9866cb724
