# DisPlayConnection

Creates a voice connection to the provided voice object and attaches logic to it.

```js
import { DisPlayConnection, DisPlayEvent } from 'discord-play';

// some code
const connection = new DisPlayConnection(message.member.voice);
```



#### List of events triggered along with usages :

- `DisPlayEvent.VOICE_JOIN` - When a voice channel is joined successfully

  ```js
  connection.on(DisPlayEvent.VOICE_JOIN, (voiceId) => {
  	message.reply("Joined voice channel");
  });
  ```

- `DisPlayEvent.VOICE_LEAVE` - When a voice channel is left due to some reason

  ```js
  connection.on(DisPlayEvent.VOICE_LEAVE, (voiceId) => {
  	message.reply("Left voice");
  });
  ```

- `DisPlayEvent.VOICE_MOVE` - When the bot was moved from one voice channel to another

  (*Note: This event takes 3 seconds to trigger as it takes 3 seconds to decide whether it was moved to another voice channel or kicked.*)

  ```js
  connection.on(DisPlayEvent.VOICE_MOVE, (oldVoiceId, newVoiceId) => {
  	message.reply("Got moved");
  });
  ```

- `DisPlayEvent.VOICE_KICK` - When the bot was forcibly kicked from the voice channel

  (*Note: This event takes 3 seconds to trigger as it takes 3 seconds to decide whether it was moved to another voice channel or kicked.*)

  ```js
  connection.on(DisPlayEvent.VOICE_KICK, (voiceId) => {
  	message.reply("Bot was manually kicked from the voice channel");
  });
  ```

- `DisPlayEvent.CONNECTION_ERROR` - When the connection fails and reconnection too fails

  ```js
  connection.on(DisPlayEvent.CONNECTION_ERROR, () => {
  	message.reply("Bot left voice due to connection error");
  });
  ```

- `DisPlayEvent.SELF_DEAFEN` - When the `toggleDeafen()` was used to deafen/undeafen the bot

  ```js
  connection.on(DisPlayEvent.SELF_DEAFEN, (value) => {
  	if (value) {
          message.reply("Bot has been self-deafened");
      } else { 
          message.reply("Bot has been self-undeafened");
      }
  });
  ```

- `DisPlayEvent.SELF_MUTE` - When the `toggleMute()` was used to mute/unmute the bot

  ```js
  connection.on(DisPlayEvent.SELF_MUTE, (value) => {
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



# DisPlayPlayer (Beta)

Creates the audio player and attaches it to the active voice connection in the guild provided.

```js
import { DisPlayPlayer, DisPlayEvent } from 'discord-play';

// some code
const player = new DisPlayPlayer(message.guild.id);
```



#### List of events triggered along with usages :

- `DisPlayEvent.PLAYING` - When the player starts playing a resource

  ```js
  player.on(DisPlayEvent.PLAYING, (resource) => {
  	message.reply("Now playing");
  });
  ```

- `DisPlayEvent.FINISHED` - When the player has finished playing a resource

  ```js
  player.on(DisPlayEvent.FINISHED, (oldResource) => {
  	message.reply("Finished playing");
  });
  ```

- `DisPlayEvent.BUFFERING` - When the player is preparing/loading the resource

  ```js
  player.on(DisPlayEvent.BUFFERING, () => {
  	message.reply("Loading resource...");
  });
  ```

- `DisPlayEvent.PAUSE` - When the player was paused manually

  ```js
  player.on(DisPlayEvent.PAUSE, () => {
  	message.reply("Player has been paused");
  });
  ```

- `DisPlayEvent.RESUME` - When the player was resumed manually

  ```js
  player.on(DisPlayEvent.RESUME, () => {
  	message.reply("Playing has been resumed");
  });
  ```



#### List of methods available :

*coming soon....*
