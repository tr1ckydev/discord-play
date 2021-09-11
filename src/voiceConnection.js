import { entersState, joinVoiceChannel, VoiceConnectionDisconnectReason, VoiceConnectionStatus } from '@discordjs/voice';
import { EventEmitter } from 'events';
import { promisify } from 'util';
const wait = promisify(setTimeout);

export class DiscordPlayVoiceConnection extends EventEmitter {
    constructor(voiceObject) {
        super();
        this.readyLock = false;
        this.voiceConnection = joinVoiceChannel({ channelId: voiceObject.channel.id, guildId: voiceObject.guild.id, adapterCreator: voiceObject.guild.voiceAdapterCreator });
        setImmediate(() => this.emit('voiceConnectionCreate', this.voiceConnection));
        this.voiceConnection.on('stateChange', async (oldState, newState) => {
            if (newState.status === VoiceConnectionStatus.Disconnected) {
                if (newState.reason === VoiceConnectionDisconnectReason.WebSocketClose && newState.closeCode === 4014) {
                    let event;
                    try {
                        await entersState(this.voiceConnection, VoiceConnectionStatus.Connecting, 3_000);
                        event = 'voiceConnectionMove';
                    } catch {
                        this.voiceConnection.destroy();
                        event = 'voiceConnectionKick';
                    } finally {
                        setImmediate(() => this.emit(event));
                    }
                } else if (this.voiceConnection.rejoinAttempts < 5) {
                    await wait((this.voiceConnection.rejoinAttempts + 1) * 3_000);
                    this.voiceConnection.rejoin();
                } else {
                    this.voiceConnection.destroy();
                    setImmediate(() => this.emit('voiceReconnectionFail'));
                }
            } else if (newState.status === VoiceConnectionStatus.Destroyed) {
                setImmediate(() => this.emit('voiceConnectionDestroy'));
            } else if (!this.readyLock && (newState.status === VoiceConnectionStatus.Connecting || newState.status === VoiceConnectionStatus.Signalling)) {
                this.readyLock = true;
                try {
                    await entersState(this.voiceConnection, VoiceConnectionStatus.Ready, 20_000);
                } catch {
                    if (this.voiceConnection.state.status !== VoiceConnectionStatus.Destroyed) {
                        this.voiceConnection.destroy();
                    }
                } finally {
                    this.readyLock = false;
                }
            }
        });
    }
    async toggleDeafen() {
        const flag = this.voiceConnection.joinConfig.selfDeaf;
        this.voiceConnection.rejoin({ selfDeaf: !flag });
        setImmediate(() => this.emit('selfDeafen', !flag));
    }
    async toggleMute() {
        const flag = this.voiceConnection.joinConfig.selfMute;
        this.voiceConnection.rejoin({ selfMute: !flag });
        setImmediate(() => this.emit('selfMute', !flag));
    }
}