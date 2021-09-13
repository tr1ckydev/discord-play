[![NPM](https://nodei.co/npm/discord-play.png)](https://nodei.co/npm/discord-play/)

[![GITHUB](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/tr1ckydev/discord-play) [![DISCORD](https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/S4svCpNupM)



# discord-play (DisPlay) - Beta Project

A powerful module backed by play-dl to create music bots easily and also interact with the new voice module for discord.js v13 in a more robust manner.



## Features

- A flexible discord.js module to make music bots without any API key using `play-dl`
- Supports YouTube and Spotify (only at the moment)
- Premade AudioPlayer and VoiceConnection event-based logic modules to simplify interacting with the new `@discordjs/voice` module
- 100% promise based
- 100% event logic based

## Installation

[![NPM](https://nodei.co/npm/discord-play.png?mini=true)](https://nodei.co/npm/discord-play/)

#### Pre-requisites

The following are some **required** npm packages to be installed (alternatives provided) :

- `discord.js` v13+ only
- The new voice library - `@discordjs/voice`
- Opus encoding library - `@discordjs/opus` or `opusscript`
- FFmpeg - `ffmpeg-static` or ffmpeg installed globally in your system
- Encrytion package - `sodium` or `libsodium-wrappers`
- The data fetching module - `play-dl`

## Basic Usage

```js
// ES6 JS or TS
import { DiscordPlay, DisPlayEvent } from 'discord-play';

//Common JS
const { DiscordPlay, DisPlayEvent } = require('discord-play');
```

**The main DiscordPlay module is currently work in progress but the separate modules are available for use.**

## Implementing the separate modules in your project

`DisPlayConnection` and `DisPlayPlayer` are two complete premade event-driven modules available inside DiscordPlay. You can include them in your project separately according to your need.

The full documentation for these two modules are available [here](./src/README.md).

```js
import {
    DisPlayConnection, DisPlayPlayer, DisPlayEvent
} from 'discord-play';

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
