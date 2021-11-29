import { AudioPlayerState } from '@discordjs/voice';

/**
 * The events emitted from DisPlayConnection class.
 */
export interface ConnectionEvents {

    /**
     * The event when a voice channel is joined successfully.
     * @param voiceId - The ID of the joined voice channel.
     */
    voiceConnectionCreate: (voiceId: string | null) => void;

    /**
     * The event when bot is moved from one voice channel to another.
     * @param oldVoiceId - The ID of the previous voice channel.
     * @param newVoiceId - The ID of the new voice channel.
     */
    voiceConnectionMove: (oldVoiceId: string | null, newVoiceId: string | null) => void;

    /**
     * The event when bot is manually kicked from a voice channel.
     * @param voiceId - The ID of the voice channel from where the bot was kicked.
     * @remarks May take upto 3 seconds for event to fire after the bot is kicked.
     */
    voiceConnectionKick: (voiceId: string | null) => void;

    /**
     * The event when a voice channel is left due to manual disconnection,
     * kicked or due to some error.
     * @param voiceId - The ID of voice channel which was left.
     */
    voiceConnectionDestroy: (voiceId: string | null) => void;

    /**
     * The event when deafening status of bot gets changed.
     * @param flag - If true, bot is deafened and hence is unable to receive audio else undeafened.
     */
    selfDeafen: (flag: boolean) => void;

    /**
     * 
     */
    selfMute: (flag: boolean) => void;

    /**
     * The event when connection emits an error.
     * @param error - The error info.
     */
    error: (error: Error) => void;
}

/**
 * The events emitted from DisPlayPlayer class.
 */
export interface PlayerEvents {

    /**
     * The event when player transitions into buffering state while loading the resource.
     * @param oldState - The previous audio player state.
     * @param newState - The newer audio player state.
     */

    audioPlayerBuffer: (oldState: AudioPlayerState, newState: AudioPlayerState) => void;
    /**
     * The event when player starts playing a resource after buffering it.
     * @param oldState - The previous audio player state.
     * @param newState - The newer audio player state.
     */
    audioPlayerStart: (oldState: AudioPlayerState, newState: AudioPlayerState) => void;

    /**
     * The event when the player finishes playing a resource.
     * @param oldState - The previous audio player state.
     * @param newState - The newer audio player state.
     */
    audioPlayerFinish: (oldState: AudioPlayerState, newState: AudioPlayerState) => void;

    /**
     * The event when the player was manually paused.
     * @param oldState - The previous audio player state.
     * @param newState - The newer audio player state.
     */
    audioPlayerPause: (oldState: AudioPlayerState, newState: AudioPlayerState) => void;

    /**
     * The event when the player was manually resumed from the paused state.
     * @param oldState - The previous audio player state.
     * @param newState - The newer audio player state.
     */
    audioPlayerResume: (oldState: AudioPlayerState, newState: AudioPlayerState) => void;

    /**
     * The event when the player goes into paused state if noSubscriberBehaviour is set to autopaused.
     * @param oldState - The previous audio player state.
     * @param newState - The newer audio player state.
     * 
     * @remarks This event should probably never occur.
     */
    audioPlayerAutoPause: (oldState: AudioPlayerState, newState: AudioPlayerState) => void;

    /**
     * The event when player emits an error.
     * @param error - The error info.
     */
    error: (error: Error) => void;
}