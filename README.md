# discord-play

A powerful module backed by play-dl to create music bots easily and also interact with the new voice module for discord.js v13 in a more robust manner.



## Features

- A flexible discord.js module to make music bots without any API key using `play-dl`
- Supports YouTube and Spotify (only at the moment)
- Premade AudioPlayer and VoiceConnection event-based logic modules to simplify interacting with the new `@discordjs/voice` module
- 100% promise based
- 100% event logic based

------



## Installation

```bash
npm install discord-play
```

#### Pre-requisites

The following are some **required** npm packages to be installed (alternatives provided) :

- `discord.js` v13+ only
- The new voice library - `@discordjs/voice`
- Opus encoding library - `@discordjs/opus` or `opusscript`
- FFmpeg - `ffmpeg-static` or ffmpeg installed globally in your system
- Encrytion package - `sodium` or `libsodium-wrappers`
- The data fetching module - `play-dl`

------



## Usage

At the moment using `require` doesn't work. You would need to add `"type": "module"` in your `package.json` to enable using es6 import. (**Sidenote:** import performs better than require in some cases)

```js
// ES6 JS or TS
import { DiscordPlay, PlayEvents } from 'discord-play';
```

#### The main DiscordPlay module is currently work in progress but the separate modules are available for use.

------



## Implementing the separate modules in your project

`DiscordPlayVoiceConnection` and `DiscordPlayAudioPlayer` are two complete premade event-driven modules available inside DiscordPlay. You can include them in your project separately according to your need.

```js
import {
    DiscordPlayVoiceConnection, DiscordPlayAudioPlayer, PlayEvents
} from 'discord-play';

// joins the voice channel and attaches all connection logic
const connection = new DiscordPlayVoiceConnection(message.member.voice);
// attaches the premade audio player to the connection created
const player = new DiscordPlayAudioPlayer(message.guild.id);

// sample connection event
connection.on(PlayEvents.VOICE_JOIN, (voice) => {
	message.reply("Joined the voice channel.");
});

// sample player event
player.on(PlayEvents.PLAYING, () => {
    message.channel.send("Now playing.");
});
```

#### The full documentation for these two modules are available [here](./src/README.md).
