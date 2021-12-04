import { AudioPlayer, AudioPlayerPlayingState, AudioPlayerStatus as Status, AudioResource, createAudioPlayer, createAudioResource, getVoiceConnection, StreamType } from '@discordjs/voice';
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
     * Stores volume amount before muting the player, which can be restored back
     * when unmuting the player.
     */
    private volumeCache: number | null = null;

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
     * Plays the input audio resource, and any previously playing resource gets destroyed and replaced.
     * @param source - Can be either :
     * - Audio url i.e. local file path or an online audio url (will require ffmpeg).
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
     * Returns the amount of volume in percentage (0 to 100) of the player resource.
     * @remarks Returns percentage of volume else `undefined` if player doesn't have
     * any underlying resource or resource doesn't have inline volume enabled (has 100% volume).
     */
    public get volume() {
        if (this.player.state.status !== Status.Idle) {
            const vol = this.player.state.resource.volume?.volume
            return vol ? vol * 100 : vol;
        }
        return undefined;
    }

    /**
     * Changes volume of the underlying resource of the player.
     * @param volume - Percentage of volume to set (0 to 100).
     * @returns `true` if volume is changed successfully, otherwise `false`.
     * @remarks Works only when inline volume of resource was enabled.
     */
    public setVolume(volume: number) {
        if (this._isVolumeChangeable()) {
            (this.player.state as AudioPlayerPlayingState).resource.volume!.setVolume(volume / 100);
            return true;
        }
        return false;
    }

    /**
     * Mutes/Unmutes the audio player.
     * @returns `true` if player was muted, otherwise `false`.
     * @remarks Requires the currently playing audio resource to have inline volume enabled.
     * @throws Error if resource doesn't have inline volume enabled.
     */
    public toggleMute() {
        if (!this._isVolumeChangeable()) throw new Error("Unable to detect resource with inline volume enabled.");
        if (!this.volumeCache) {
            this.volumeCache = this.volume ?? null;
            this.setVolume(0);
            return true;
        } else {
            this.setVolume(this.volumeCache);
            this.volumeCache = null;
            return false;
        }
    }

    /**
     * To detect if currently underlying resource (if any) has inline volume enabled or not.
     * @returns `true` if inline volume is enabled, otherwise `false`.
     */
    private _isVolumeChangeable() {
        if (this.player.state.status !== Status.Idle) {
            return this.player.state.resource.volume ? true : false;
        }
        return false;
    }

}