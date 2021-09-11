import { AudioPlayerStatus, createAudioPlayer, getVoiceConnection } from '@discordjs/voice';
import { EventEmitter } from 'events';

export class DiscordPlayAudioPlayer extends EventEmitter {
    constructor(guildID) {
        super();
        const voiceConnection = getVoiceConnection(guildID);
        if(!voiceConnection) throw new Error("no active voice connection found");
        this.player = createAudioPlayer();
        this.player.on('stateChange', (oldState, newState) => {
            if (newState.status === AudioPlayerStatus.Buffering)
                setImmediate(() => this.emit('audioPlayerBuffer', newState));

            else if (newState.status === AudioPlayerStatus.Playing && oldState.status === AudioPlayerStatus.Idle)
                setImmediate(() => this.emit('audioPlayerStart', oldState, newState));

            else if (newState.status === AudioPlayerStatus.Idle && oldState.status === AudioPlayerStatus.Playing)
                setImmediate(() => this.emit('audioPlayerFinish', oldState, newState));

            else if (newState.status === AudioPlayerStatus.Paused && oldState.status === AudioPlayerStatus.Playing)
                setImmediate(() => this.emit('audioPlayerPause', oldState, newState));

            else if (newState.status === AudioPlayerStatus.Playing && oldState.status === AudioPlayerStatus.Paused)
                setImmediate(() => this.emit('audioPlayerResume', oldState, newState));
        });
        voiceConnection.subscribe(this.player);
    }
}