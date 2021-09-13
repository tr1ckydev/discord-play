export enum DisPlayEvent {
    /**
     * ok
     */
    VOICE_JOIN = "voiceConnectionCreate",
    /**
     * 
     */
    VOICE_LEAVE = "voiceConnectionDestroy",
    /**
     * 
     */
    VOICE_MOVE = "voiceConnectionMove",
    /**
     * 
     */
    VOICE_KICK = "voiceConnectionKick",
    /**
     * 
     */
    SELF_DEAFEN = "selfDeafen",
    /**
     * 
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