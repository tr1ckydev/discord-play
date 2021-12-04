[![NPM](https://nodei.co/npm/discord-play.png)](https://nodei.co/npm/discord-play/)

[![GITHUB](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/tr1ckydev/discord-play) [![DISCORD](https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/S4svCpNupM)



# discord-play (DisPlay)

A robust wrapper module for [@discordjs/voice](https://www.npmjs.com/package/@discordjs/voice), implementing functions and emitting events making it easier to interact with the new voice module.



## Features

- DisPlayConnection *(Voice Connection class)*
  - Emits [voice connection events](https://discord-play.netlify.app/interfaces/interfaces_events.connectionevents) like `voiceConnectionKick`, `voiceConnectionMove`, etc.
  - Contains utility functions such as `toggleMute` and `toggleDeafen`.
  - Contains built-in reconnection logic.

- DisPlayPlayer *(Audio Player class)*
  - Emits [audio player events](https://discord-play.netlify.app/interfaces/interfaces_events.playerevents) like `audioPlayerStart`, `audioPlayerFinish`, etc.
  - Contains a simplified powerful [`play` function](https://discord-play.netlify.app/classes/classes_player.displayplayer#play) which supports playing from local audio files or online audio urls to readable stream of audio data or even a premade Audio Resource.
  - Contains utility functions such as `togglePause`, `toggleMute`.



## Documentation

- [Main documentation site](https://discord-play.netlify.app/)
- [DisPlayConnection](https://discord-play.netlify.app/classes/classes_connection.displayconnection)
- [DisPlayPlayer](https://discord-play.netlify.app/classes/classes_player.displayplayer)

For any help, feel free to join the [discord server](https://discord.gg/S4svCpNupM) and ask.



## Installation

[![NPM](https://nodei.co/npm/discord-play.png?mini=true)](https://nodei.co/npm/discord-play/)

#### Pre-requisites

The following are some **required** npm packages to be installed (alternatives provided) :

- `discord.js` v13+
- The new voice library - `@discordjs/voice` (Gets automatically installed as dependency)
- Opus encoding library - `@discordjs/opus` or `opusscript`
- FFmpeg - `ffmpeg-static` or ffmpeg installed globally in your system
- Encrytion package - `sodium` or `libsodium-wrappers`



## Importing

```js
import { DiscordPlay, DisPlayEvent } from 'discord-play';
// or
const { DiscordPlay, DisPlayEvent } = require('discord-play');
```



## Basic Usage

```js
import { DisPlayConnection, DisPlayPlayer, DisPlayEvent } from 'discord-play';

// joins the voice channel and attaches all connection logic
const connection = new DisPlayConnection(message.member.voice);
// attaches the premade audio player to the connection created
const player = new DisPlayPlayer(message.guild.id);

// sample connection event
connection.on(DisPlayEvent.VOICE_JOIN, (voiceId) => {
	message.reply("Joined the voice channel.");
});

// sample player event
player.on(DisPlayEvent.PLAYING, () => {
    message.channel.send("Now playing.");
});
```



## License

This repository uses [MIT license](https://github.com/tr1ckydev/discord-play/blob/main/LICENSE).
