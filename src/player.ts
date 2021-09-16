import { AudioPlayer, AudioPlayerState, AudioPlayerStatus, AudioPlayerStatus as Status, createAudioPlayer, createAudioResource, getVoiceConnection, NoSubscriberBehavior, StreamType, VoiceConnection } from '@discordjs/voice';
import { TypedEmitter } from 'tiny-typed-emitter';

export interface PlayerEvents {
    /**
     * The event when the player transitions into buffering state i.e. loading the resource.
     */
    audioPlayerBuffer: (oldState: AudioPlayerState, newState: AudioPlayerState) => void,
    /**
     * The event when the player starts playing a resource.
     */
    audioPlayerStart: (oldState: AudioPlayerState, newState: AudioPlayerState) => void,
    /**
     * The event when the player finishes playing a resource.
     */
    audioPlayerFinish: (oldState: AudioPlayerState, newState: AudioPlayerState) => void,
    /**
     * The event when the player was manually paused.
     */
    audioPlayerPause: (oldState: AudioPlayerState, newState: AudioPlayerState) => void,
    /**
     * The event when the player was manually resumed from the paused state.
     */
    audioPlayerResume: (oldState: AudioPlayerState, newState: AudioPlayerState) => void,
    /**
     * The event when the player goes into paused state if noSubscriberBehaviour is set to autopaused.
     */
    audioPlayerAutoPause: (oldState: AudioPlayerState, newState: AudioPlayerState) => void,
    /**
     * The event when the player encounters a error.
     */
    error: (error: Error) => void,
}

export class Player extends TypedEmitter<PlayerEvents> {
    public player: AudioPlayer = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Stop
        }
    });
    /**
     * Constructor to create and assign the audio player to the guild voice connection.
     * @param guildId 
     * @returns 
     */
    public constructor(guildId: string) {
        super();
        const connection: VoiceConnection | undefined = getVoiceConnection(guildId);
        if (!connection) {
            this.emit('error', new Error("no active connection found"));
            return;
        }
        this.player.on('stateChange', (oldState, newState) => {
            if (newState.status === Status.Buffering)
                this.emit('audioPlayerBuffer', oldState, newState);
            else if (newState.status === Status.Playing && oldState.status === Status.Buffering)
                this.emit('audioPlayerStart', oldState, newState);
            else if (newState.status === Status.Idle && oldState.status === Status.Playing)
                this.emit('audioPlayerFinish', oldState, newState);
            else if (newState.status === Status.Paused && oldState.status === Status.Playing)
                this.emit('audioPlayerPause', oldState, newState);
            else if (newState.status === Status.Playing && oldState.status === Status.Paused)
                this.emit('audioPlayerResume', oldState, newState);
            else if (newState.status === Status.AutoPaused)
                this.emit('audioPlayerAutoPause', oldState, newState);
            else this.emit('error', new Error(`unknown_state_change (${oldState.status} -> ${newState.status})`));
        });
        this.player.on('error', (error) => void this.emit('error', error));
        try {
            connection.subscribe(this.player);
        } catch (error: any) {
            this.emit('error', error);
        }
    }
    /**
     * Plays an audio from a local file or url.
     * @param {string} path The path to the audio file.
     */
    public play(path: string): void {
        try {
            const resource = createAudioResource(path, { inputType: StreamType.Arbitrary });
            void this.player.play(resource);
        } catch (error: any) {
            this.emit('error', error);
        }
    }
    /**
     * Stops the audio player and destroys any playing resource.
     * @returns {boolean}
     */
    public stop(): boolean { return this.player.stop(); }
    /**
     * Pauses/Unpauses the audio player.
     * @returns {boolean}
     */
    public togglePause(): boolean {
        if (this.player.state?.status === AudioPlayerStatus.Paused) {
            return this.player.unpause();
        } else if (this.player.state?.status === AudioPlayerStatus.Playing) {
            return this.player.pause(true);
        } else {
            return false;
        }
    }
    /**
     * To check if the underlying resource is playble or not.
     * @returns {boolean}
     */
    public isPlayable(): boolean { return this.player.checkPlayable(); }
}