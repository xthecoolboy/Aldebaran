exports.run = (bot, message, args) => {
    const config = require('./../../config.json');
    const { RichEmbed } = require('discord.js');
    const Nodesu = require('nodesu');
    const client = new Nodesu.Client(config.apikeys["osu!"]);
    if (args.length === 0) return message.channel.send(`You need to send a link of the beatmap or its ID. Check \`&osu ?\` for more informations.`);
    if (args[0].toLowerCase() === '?') {
        const embed = new RichEmbed()
            .setAuthor(message.author.username, message.author.avatarURL)
            .setTitle(`Documentation for the osu! (Beatmap) command`)
            .setDescription(`First, you have to send the link of the beatmap you want to see the informations, or you also use its ID. After that, you can choose the mode to show the informations from, note that the default mode is standard. See more informations below. You can also specify with which mods you want to play, by adding \`+\` before, like that : \`+HDDT\`, specify the combo you want like \`x666\` or your accuracy with \`69%\`. The most completed command would be \`&osumap https://osu.ppy.sh/beatmapsets/627629#osu/1322507 +HDDT x2000 90%\`. This command does not work with beatmapsets or by the name of beatmaps.`)
            .addField(`Supported Modes`, `**osu!standard** : BY DEFAULT, --osu\n**osu!taiko** : --taiko\n**osu!ctb** : --ctb\n**osu!mania** : --mania`, true)
            .addField(`Supported Mods`, `NF, EZ, HT, SO, HR, DT, NC, HD, FL`, true)
            .setColor(`BLUE`);
        message.channel.send({embed});
    } else {
        var mode = 'osu', mods = [], modsBitfield = 0, supportedMods = ['NF', 'EZ', 'HT', 'SO', 'HR', 'DT', 'NC', 'HD', 'FL'], combo = null, accuracy = 95;
        for (let element of args) {
            if (element.indexOf('--') === 0) mode = element.replace('--', '');   
            else if (element.indexOf('+') === 0) {
                mods = element.replace('+', '').split(/([A-Z]{2})/g);
                mods = mods.filter(v => v !== '' && supportedMods.indexOf(v) !== -1);
            } else if (element.indexOf('x') === 0) {
                if (!isNaN(parseInt(element.replace('x', '')))) combo = parseInt(element.replace('x', ''));
            } else if (element.indexOf('%') === element.length - 1) {
                if (!isNaN(parseFloat(element.replace('%', '')))) accuracy = parseFloat(element.replace('%', ''));
            }
        };
        if (Nodesu.Mode[mode] !== undefined) {
            client.beatmaps.getByBeatmapId(args[0].split('/').pop(), Nodesu.Mode[mode], undefined, 'string').then(data => {
                var approvalStatus = null;
                const beatmap = new Nodesu.Beatmap(data[0]);
                for (let [key, value] of Object.entries(Nodesu.ApprovalStatus)) if (value == beatmap.approved) approvalStatus = key;
                approvalStatus = approvalStatus[0].toUpperCase() + approvalStatus.slice(1);
                const d = x => { return x.toString().length === 1 ? `0${x}` : x };
                const returnDate = x => { return `${d(x.getUTCMonth()+1)}/${d(x.getUTCDay()+1)}/${x.getUTCFullYear()} ${d(x.getUTCHours())}:${d(x.getUTCMinutes())} UTC` };
                const returnDuration = x => { return x > 60 ? `${Math.floor(x/60)}m${d(x%60)}s` : `${x}s` }
                require(`${process.cwd()}/functions/osu!/retrieveBeatmapFile.js`)(beatmap.id).then(() => {
                    const oppai = require('oppai');
                    var ctx = oppai.Ctx(), b = oppai.Beatmap(ctx);
                    b.parse(`./osu/${beatmap.id}.osu`, oppai.Buffer(2000000), 2000000, true);
                    if (mods.length !== 0) { 
                        for (let mod of mods) modsBitfield += oppai[mod.toLowerCase()];
                    } else mods = ['NoMod'];
                    if (combo === null) combo = beatmap.maxCombo;
                    b.applyMods(modsBitfield);
                    const dctx = oppai.DiffCalcCtx(ctx), diff = dctx.diffCalc(b);
                    const embed = new RichEmbed()
                        .setAuthor(beatmap.creator, `https://a.ppy.sh/${data[0].creator_id}`, `https://osu.ppy.sh/users/${data[0].creator_id}`)
                        .setTitle(`__**${beatmap.title}** by ${beatmap.artist}__ [${beatmap.version}] (+${mods.join('')} **${diff.stars.toFixed(2)} ★**)`)
                        .setURL(`https://osu.ppy.sh/beatmapsets/${beatmap.setId}/#${mode}/${beatmap.id}`)
                        .addField(`Map Length`, `**Playing Duration** : ${returnDuration(beatmap.hitLength)}\n**Song Duration** : ${returnDuration(beatmap.totalLength)}`, true)
                        .addField(`Rank Status`, `${data[0].approved_date === null ? `**${approvalStatus}**\nLast Updated on ${returnDate(new Date(data[0].last_update))}` : `**${approvalStatus}** on ${returnDate(new Date(data[0].approved_date))}`}`, true)
                        .addField(`Specifications`, `${beatmap.bpm} **BPM** | **Max Combo** x${beatmap.maxCombo}\n**CS**${beatmap.diffSize} | **AR**${beatmap.diffApproach} | **HP**${beatmap.diffDrain} | **OD**${beatmap.diffOverall}`, true)
                        .addField(`PPs Calculations`, `**FC (100%)** : ${ctx.ppCalc(diff.aim, diff.speed, b, modsBitfield, combo).pp.toFixed(2)} PPs\n**${combo === beatmap.maxCombo ? ` FC (${accuracy}%)` : `${accuracy}%`} ** : ${ctx.ppCalcAcc(diff.aim, diff.speed, b, accuracy, modsBitfield, combo).pp.toFixed(2)} PPs`, true)
                        .setImage(`https://assets.ppy.sh/beatmaps/${beatmap.setId}/covers/cover.jpg`)
                        .setColor(`#cc5288`);
                    if (beatmap.source !== null) embed.setFooter(`Source : ${beatmap.source}`)
                    message.channel.send({embed});
                });
            }).catch((err) => {
                message.reply("the map you specified does not exist, or at least in the mode specified.");
                throw err;
            });
        } else {
            message.reply("the mode you specified does not exist. Check \`&osu ?\` for more informations.");
        }
    }
}

exports.infos = {
    category: "osu!",
    description: "Shows the informations of the map specified",
    usage: "\`&osu <Beatmap Link|Beatmap ID>\`",
    example: "\`&osumap 1588069\`",
    cooldown: {
        time: 1000,
        rpm: 600,
        resetTime: 60000,
        commandGroup: "osu!"
    }
}