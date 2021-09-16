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
     * 
     */
    BUFFERING = "audioPlayerBuffer",
    /**
     * 
     */
    PLAYING = "audioPlayerStart",
    /**
     * 
     */
    FINISH = "audioPlayerFinish",
    /**
     * 
     */
    PAUSE = "audioPlayerPause",
    /**
     * 
     */
    AUTOPAUSE = "audioPlayerAutoPause",
    /**
     * 
     */
    RESUME = "audioPlayerResume",
}