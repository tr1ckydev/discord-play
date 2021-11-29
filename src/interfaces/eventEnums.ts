export enum DisPlayEvent {
    /**
     * The event when voice connection has been created.
     */
    VOICE_JOIN = "voiceConnectionCreate",
    /**
     * The event when voice connection has been destroyed (i.e. bot left the voice channel).
     */
    VOICE_LEAVE = "voiceConnectionDestroy",
    /**
     * The event when bot is moved from one voice channel to another.
     */
    VOICE_MOVE = "voiceConnectionMove",
    /**
     * The event when bot was forcibly kicked from voice channel.
     */
    VOICE_KICK = "voiceConnectionKick",
    /**
     * The event when `selfDeafen()` was used.
     */
    SELF_DEAFEN = "selfDeafen",
    /**
     * The event when `selfMute()` was used.
     */
    SELF_MUTE = "selfMute",
    /**
     * The event when audio resource is buffering before being played.
     */
    BUFFERING = "audioPlayerBuffer",
    /**
     * The event after resource has buffered and has started playing.
     */
    PLAYING = "audioPlayerStart",
    /**
     * The event when resource stops playing, i.e. player goes to *Idle* state.
     */
    FINISH = "audioPlayerFinish",
    /**
     * The event when the player was paused using `toggleMute()` function.
     */
    PAUSE = "audioPlayerPause",
    /**
     * The event when the player was goes autopaused due to nosubscriber behavior.
     */
    AUTOPAUSE = "audioPlayerAutoPause",
    /**
     * The event when the player was unpaused using `toggleMute()` function.
     */
    RESUME = "audioPlayerResume",
}