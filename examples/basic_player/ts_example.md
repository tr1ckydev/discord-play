```tsx
import { Client, Intents, Message } from 'discord.js';
import { DisPlayConnection, DisPlayEvent, DisPlayPlayer } from 'discord-play';

const client: Client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
});

client.once('ready', () => console.log('Ready!'));

interface Command {
    name: string,
    args: string[]
}

let connection: DisPlayConnection, player: DisPlayPlayer;

client.on('messageCreate', async (message: Message) => {
    const command: Command = parseCommand(message.content);
    switch (command.name) {

        case "?join": {
            if (connection) { message.reply("Already joined a voice channel."); return; }
            connection = new DisPlayConnection(message.member.voice);
            player = new DisPlayPlayer(message.guild.id);
            player.on(DisPlayEvent.BUFFERING, (oldState, newState) => {
                message.channel.send("Loading resource");
            });
            player.on(DisPlayEvent.PLAYING, (oldState, newState) => {
                message.channel.send("Started playing");
            });
            player.on(DisPlayEvent.FINISH, (oldState, newState) => {
                message.channel.send("Finished playing");
            });
            player.on('error', error => {
                message.channel.send("Error");
                console.log(error);
            });
            break;
        }

        case "?play": {
            player.play('./sample.mp3');
            /* You can also pass an online audio link too.
             * `player.play(command.args[0]);`
             * (e.g. `?play www.sample.com/media/audio.mp3`)
             * 
             * There is an issue currently with ffmpeg-static, ONLY not
             * being able to play online audio links, rest works fine.
             * If you really want to play online audio links,
             * install original `ffmpeg` globally in your system instead
             * of static version.
             */
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
            message.channel.send("Deafen toggled.");
            break;
        }

        case "?leave": {
            if (!connection) { message.reply("No connection found"); return; }
            try {
                await connection.destroy();
                message.reply("Left voice channel");
            } catch {
                message.channel.send("No connection found");
            }
            break;
        }

        case "?getreport": {
            message.reply(`\`\`\`js
            ${connection.getDependancies()}
            \`\`\``);
            // It will return you the ffmpeg version along with other dependancies.
        }

    }
});

client.login("your-bot-token-here");

function parseCommand(content: string): Command {
    const args: string[] = content.split(' ');
    const name: string = args.shift();
    return { name, args };
}
```

