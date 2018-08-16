const poolQuery = require(`${process.cwd()}/functions/database/poolQuery`);
const { Attachment } = require('discord.js');
const util = require('util');
exports.run = function(bot, message, args) {
    poolQuery(args.join(' ')).then(result => {
        message.channel.send(util.inspect(result, false, null), {code:"xl"}).catch(err => {
            message.channel.send(`The result was too long to be sent on Discord. Everything is in the attachment.`, {
                files: [new Attachment(Buffer.from(util.inspect(result, false, null)), 'test.txt')]
            });
        });
    }).catch(err => {
        message.channel.send(`An error occured.\n\`\`\`xl\n${err}\n\`\`\``);
    });
}
exports.infos = {
    category: "Developer",
    description: "Queries Attached DB",
    usage: "\`&query <sqlstatement>\`",
    example: "\`&query SELECT * FROM users WHERE userid = 310296184436817930\`",
    restrictions: "Developer Only"
}
exports.developer = true;