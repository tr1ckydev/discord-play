# DiscordPlayVoiceConnection

Creates a voice connection to the provided voice object and attaches logic to it.

```js
import { DiscordPlayVoiceConnection, PlayEvents } from 'discord-play';

// some code
const connection = new DiscordPlayVoiceConnection(message.member.voice);
```



#### List of events triggered along with usages :

- `PlayEvents.VOICE_JOIN` - When a voice channel is joined successfully

  ```js
  connection.on(PlayEvents.VOICE_JOIN, (voice) => {
  	message.reply("Joined voice channel: " + voice.name);
  });
  ```

- `PlayEvents.VOICE_LEAVE` - When a voice channel is left due to some reason

  ```js
  connection.on(PlayEvents.VOICE_LEAVE, (voice, reason) => {
  	message.reply("Left voice " + voice.name + " due to " + reason);
  });
  ```

- `PlayEvents.VOICE_MOVE` - When the bot was moved from one voice channel to another

  (*Note: This event takes 3 seconds to trigger as it takes 3 seconds to decide whether it was moved to another voice channel or kicked.*)

  ```js
  connection.on(PlayEvents.VOICE_MOVE, (oldVoice, newVoice) => {
  	message.reply("Got moved from " + oldVoice.name + " to " + newVoice.name);
  });
  ```

- `PlayEvents.VOICE_KICK` - When the bot was forcibly kicked from the voice channel

  (*Note: This event takes 3 seconds to trigger as it takes 3 seconds to decide whether it was moved to another voice channel or kicked.*)

  ```js
  connection.on(PlayEvents.VOICE_KICK, () => {
  	message.reply("Bot was manually kicked from the voice channel");
  });
  ```

- `PlayEvents.CONNECTION_ERROR` - When the connection fails and reconnection too fails

  ```js
  connection.on(PlayEvents.CONNECTION_ERROR, () => {
  	message.reply("Bot left voice due to connection error");
  });
  ```

- `PlayEvents.SELF_DEAFEN` - When the `toggleDeafen()` was used to deafen/undeafen the bot

  ```js
  connection.on(PlayEvents.SELF_DEAFEN, (value) => {
  	if (value) {
          message.reply("Bot has been self-deafened");
      } else { 
          message.reply("Bot has been self-undeafened");
      }
  });
  ```

- `PlayEvents.SELF_MUTE` - When the `toggleMute()` was used to mute/unmute the bot

  ```js
  connection.on(PlayEvents.SELF_MUTE, (value) => {
  	if (value) {
          message.reply("Bot has been self-muted");
      } else {
          message.reply("Bot has been self-unmuted");
      }
  });
  ```



#### List of methods available :

- `connection.toggleDeafen()` - To deafen/undeafen the bot (if deafened, will not be able to receive audio)
- `connection.toggleMute()` - To mute/unmute the bot (if muted, will not be able to emit audio)
- *more coming soon...*



------



# DiscordPlayAudioPlayer

Creates the audio player and attaches it to the active voice connection in the guild provided.

```js
import { DiscordPlayAudioPlayer, PlayEvents } from 'discord-play';

// some code
const player = new DiscordPlayAudioPlayer(message.guild.id);
```



#### List of events triggered along with usages :

- `PlayEvents.PLAYING` - When the player starts playing a resource

  ```js
  player.on(PlayEvents.PLAYING, (resource) => {
  	message.reply("Now playing");
  });
  ```

- `PlayEvents.FINISHED` - When the player has finished playing a resource

  ```js
  player.on(PlayEvents.FINISHED, (oldResource) => {
  	message.reply("Finished playing");
  });
  ```

- `PlayEvents.BUFFERING` - When the player is preparing/loading the resource

  ```js
  player.on(PlayEvents.BUFFERING, () => {
  	message.reply("Loading resource...");
  });
  ```

- `PlayEvents.PAUSE` - When the player was paused manually

  ```js
  player.on(PlayEvents.PAUSE, () => {
  	message.reply("Player has been paused");
  });
  ```

- `PlayEvents.RESUME` - When the player was resumed manually

  ```js
  player.on(PlayEvents.RESUME, () => {
  	message.reply("Playing has been resumed");
  });
  ```



#### List of methods available :

*coming soon....*
