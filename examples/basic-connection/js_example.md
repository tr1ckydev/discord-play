```js
const { Client, Intents } = require('discord.js');
const { DisPlayConnection, DisPlayEvent } = require('discord-play');

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
});

client.once('ready', () => console.log('Ready!'));

let connection;

client.on('messageCreate', async (message) => {
    const command = parseCommand(message.content);
    switch (command.name) {

        case "?join": {
            if (connection) { message.reply("Already joined a voice channel."); return; }
            /**
             * create new voice connection
             */
            connection = new DisPlayConnection(message.member.voice);
            connection.on(DisPlayEvent.VOICE_JOIN, (voiceId) => {
                const voice = client.channels.cache.get(voiceId);
                message.reply(`Joined voice channel \`${voice.name}\``);
            });
            connection.on(DisPlayEvent.VOICE_MOVE, (oldVoiceId, newVoiceId) => {
                const oldVoice = client.channels.cache.get(oldVoiceId);
                const newVoice = client.channels.cache.get(newVoiceId);
                message.reply(`Got moved from \`${oldVoice.name}\` to \`${newVoice.name}\``);
            });
            connection.on(DisPlayEvent.VOICE_KICK, (voiceId) => {
                const voice = client.channels.cache.get(voiceId);
                message.reply(`Kicked from \`${voice.name}\``);
            });
            break;
        }

        case "?mute": {
            if (!connection) { message.reply("No connection found"); return; }
            await connection.toggleMute();
            message.reply("Mute toggled");
            break;
        }

        case "?deafen": {
            if (!connection) { message.reply("No connection found"); return; }
            await connection.toggleDeafen();
            message.reply("Deafen toggled");
            break;
        }

        case "?leave": {
            if (!connection) { message.reply("No connection found"); return; }
            try {
                await connection.destroy();
                message.reply("Left voice channel");
            } catch {
                message.reply("No connection found");
            }
            break;
        }

    }
});

client.login("your-bot-token-here");

function parseCommand(content) {
    const args = content.split(' ');
    const name = args.shift();
    return { name, args };
}
```