export const PlayEvents = Object.freeze({

    VOICE_JOIN: 'voiceConnectionCreate',

    VOICE_LEAVE: 'voiceConnectionDestroy',

    VOICE_MOVE: 'voiceConnectionMove',

    VOICE_KICK: 'voiceConnectionKick',

    CONNECTION_ERROR: 'voiceReconnectionFail',

    SELF_DEAFEN: 'selfDeafen',

    SELF_MUTE: 'selfMute',

    BUFFERING: 'audioPlayerBuffer',

    PLAYING: 'audioPlayerStart',

    FINISH: 'audioPlayerFinish',

    PAUSE: 'audioPlayerPause',

    RESUME: 'audioPlayerResume',

});