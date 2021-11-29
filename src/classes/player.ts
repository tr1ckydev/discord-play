import { AudioPlayer, AudioPlayerStatus as Status, AudioResource, createAudioPlayer, createAudioResource, getVoiceConnection, StreamType } from '@discordjs/voice';
import { Readable } from 'node:stream';
import { TypedEmitter } from 'tiny-typed-emitter';
import { PlayerEvents } from '../interfaces/events';
import { PlayOptions } from '../interfaces/interfaces';
import { DisPlayConnection } from './connection';

/**
 * The audio player class of `discord-play`.
 * 
 * Must be created only after a voice connection is
 * established, either through a {@link DisPlayConnection} instance or the @discordjs/voice
 * `joinVoiceChannel` function.
 */
export class DisPlayPlayer extends TypedEmitter<PlayerEvents> {

    /**
     * The {@link AudioPlayer} instance from @discordjs/voice.
     */
    public readonly player = createAudioPlayer();

    /**
     * Attaches logic to the audio player and binds it to the voice connection.
     * @param guildId - The ID of the guild where the voice connection is established.
     */
    constructor(guildId: string) {
        super();
        const connection = getVoiceConnection(guildId);
        if (!connection) throw new Error("no active voice connection found in specified guild");
        this.player.on('stateChange', (oldState, newState) => {
            switch (newState.status) {
                case Status.Buffering: this.emit('audioPlayerBuffer', oldState, newState); break;
                case Status.Idle: this.emit('audioPlayerFinish', oldState, newState); break;
                case Status.Paused: this.emit('audioPlayerPause', oldState, newState); break;
                case Status.AutoPaused: this.emit('audioPlayerAutoPause', oldState, newState); break;
                case Status.Playing:
                    switch (oldState.status) {
                        case Status.Buffering: this.emit('audioPlayerStart', oldState, newState); break;
                        case Status.Paused: this.emit('audioPlayerResume', oldState, newState); break;
                        default: break;
                    }
                    break;
                default: break;
            }
        });
        this.player.on('error', error => void this.emit('error', error));
        try {
            connection.subscribe(this.player);
        } catch (error: any) {
            this.emit('error', error);
        }
    }

    /**
     * Plays the input audio resource, and any previously playing resource gets destroyed and replaced.
     * @param resource - The audio resouce.
     */
    public play(resource: AudioResource): void;

    /**
     * Plays from input source provided.
     * @param source - Can be either :
     * - Audio url i.e. local path or a url with audio endpoint (will require ffmpeg).
     * - Readable stream of audio data.
     * @param options - {@link PlayOptions}
     */
    public play(source: string | Readable, options?: PlayOptions): void;

    public play(source: string | Readable | AudioResource, options?: PlayOptions) {
        try {
            if (source instanceof AudioResource) {
                this.player.play(source);
            } else {
                const resource = createAudioResource(source, {
                    inputType: options?.streamType ?? StreamType.Arbitrary,
                    inlineVolume: options?.volume ? true : false
                });
                if (options?.volume) resource.volume?.setVolume(options.volume);
                this.player.play(resource);
            }
        } catch (error: any) {
            this.emit('error', error);
        }
    }

    /**
     * Stops the audio player and destroys any underlying resource.
     * @returns `true` if the player will come to a stop, otherwise `false`.
     */
    public stop() {
        return this.player.stop();
    }

    /**
     * Pauses/unpauses the audio player.
     * @returns `true` if player is paused, else `false` i.e. unpaused.
     */
    public togglePause() {
        switch (this.player.state?.status) {
            case Status.Playing: return this.player.pause(true);
            case Status.Paused: return !this.player.unpause();
            default: return false;
        }
    }

    /**
     * Changes volume of the underlying resource of the player.
     * @param volume - Percentage of volume to set (0 to 100).
     * @returns `true` if volume is changed successfully, otherwise `false`.
     */
    public setVolume(volume: number) {
        if (this.player.state.status !== Status.Idle) {
            this.player.state.resource.volume?.setVolume(volume / 100);
            return true;
        } else {
            return false;
        }
    }

    /**
     * Returns the amount of volume in percentage (0 to 100) of the player resource.
     * @remarks
     * Returns percentage of volume else undefined if player doesn't have any underlying resource
     * or resource doesn't have inline volume enabled (has 100% volume).
     */
    public get volume() {
        if (this.player.state.status !== Status.Idle) {
            const vol = this.player.state.resource.volume?.volume
            return vol ? vol * 100 : vol;
        } else {
            return undefined;
        }
    }

}