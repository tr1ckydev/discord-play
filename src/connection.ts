import { entersState, generateDependencyReport, joinVoiceChannel, VoiceConnection, VoiceConnectionDisconnectReason, VoiceConnectionStatus } from '@discordjs/voice';
import { TypedEmitter } from 'tiny-typed-emitter';
import { promisify } from 'util';
const wait = promisify(setTimeout);

export interface ConnectionEvents {
    /**
     * 
     */
    voiceConnectionCreate: (voiceId: string | null) => void,
    /**
     * 
     */
    voiceConnectionMove: (oldVoiceId: string | null, newVoiceId: string | null) => void,
    /**
     * 
     */
    voiceConnectionKick: (voiceId: string | null) => void,
    /**
     * 
     */
    voiceConnectionDestroy: (voidId: string | null) => void,
    /**
     * 
     */
    selfDeafen: (flag: boolean) => void,
    /**
     * 
     */
    selfMute: (flag: boolean) => void,
    /**
     * 
     */
    error: (error: Error) => void,
}

export class Connection extends TypedEmitter<ConnectionEvents> {
    public connection: VoiceConnection;
    public readyLock = false;
    private oldVoiceID: string | null;
    constructor(voice: any) {
        super();
        this.connection = joinVoiceChannel({ channelId: voice.channel.id, guildId: voice.guild.id, adapterCreator: voice.guild.voiceAdapterCreator });
        this.oldVoiceID = this.connection.joinConfig.channelId;
        setImmediate(() => this.emit('voiceConnectionCreate', this.connection.joinConfig.channelId));
        this.connection.on('stateChange', async (oldState, newState) => {
            if (newState.status === VoiceConnectionStatus.Disconnected) {
                if (newState.reason === VoiceConnectionDisconnectReason.WebSocketClose && newState.closeCode === 4014) {
                    try {
                        await entersState(this.connection, VoiceConnectionStatus.Connecting, 3_000);
                        this.emit('voiceConnectionMove', this.oldVoiceID, this.connection.joinConfig.channelId);
                        this.oldVoiceID = this.connection.joinConfig.channelId;
                    } catch {
                        this.connection.destroy();
                        this.emit('voiceConnectionKick', this.connection.joinConfig.channelId);
                    }
                } else if (this.connection.rejoinAttempts < 5) {
                    await wait((this.connection.rejoinAttempts + 1) * 3_000);
                    this.connection.rejoin();
                } else {
                    this.connection.destroy();
                    this.emit('error', new Error("connection_error"));
                }
            } else if (newState.status === VoiceConnectionStatus.Destroyed) {
                this.emit('voiceConnectionDestroy', this.connection.joinConfig.channelId);
            } else if (!this.readyLock && (newState.status === VoiceConnectionStatus.Connecting || newState.status === VoiceConnectionStatus.Signalling)) {
                this.readyLock = true;
                try {
                    await entersState(this.connection, VoiceConnectionStatus.Ready, 20_000);
                } catch {
                    if (this.connection.state.status !== VoiceConnectionStatus.Destroyed) {
                        this.connection.destroy();
                        this.emit('error', new Error("connection_error"));
                    }
                } finally {
                    this.readyLock = false;
                }
            }
        });
    }
    public async toggleDeafen() {
        const flag = this.connection.joinConfig.selfDeaf;
        this.connection.joinConfig.selfDeaf = !flag
        this.connection.rejoin(this.connection.joinConfig);
        this.emit('selfDeafen', !flag);
    }
    public async toggleMute() {
        const flag = this.connection.joinConfig.selfMute;
        this.connection.joinConfig.selfMute = !flag;
        this.connection.rejoin(this.connection.joinConfig);
        this.emit('selfMute', !flag);
    }
    public async destroy() {
        this.connection.destroy();
    }
    public getDependancies() {
        return generateDependencyReport();
    }
}