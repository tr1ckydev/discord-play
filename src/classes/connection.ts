import { AudioPlayer, entersState, joinVoiceChannel, VoiceConnection, VoiceConnectionDisconnectReason as DCReason, VoiceConnectionReadyState, VoiceConnectionStatus as Status } from '@discordjs/voice';
import { VoiceState } from 'discord.js';
import { TypedEmitter } from 'tiny-typed-emitter';
import { promisify } from 'util';
import { ConnectionEvents } from '../interfaces/events';
const wait = promisify(setTimeout);

/**
 * The voice connection class of `discord-play`. The bot joins the input voice state
 * as soon as an instance is created.
 */
export class DisPlayConnection extends TypedEmitter<ConnectionEvents> {

    /**
     * The {@link VoiceConnection} instance from @discordjs/voice.
     */
    public readonly connection: VoiceConnection;

    private readyLock = false;

    private oldVoiceID: string | null;

    /**
     * Joins the voice channel on instance creation.
     * @param voice The voice state of a member. 
     */
    constructor(voice: VoiceState) {
        super();
        if (!voice.channel) throw new Error("member voice channel not found");
        this.connection = joinVoiceChannel({ channelId: voice.channel.id, guildId: voice.guild.id, adapterCreator: voice.guild.voiceAdapterCreator });
        this.oldVoiceID = this.connection.joinConfig.channelId;
        this.connection.on('stateChange', async (oldState, newState) => {
            switch (newState.status) {
                case Status.Ready:
                    this.emit('voiceConnectionCreate', this.oldVoiceID);
                    break;
                case Status.Destroyed:
                    this.emit('voiceConnectionDestroy', this.oldVoiceID);
                    break;
                case Status.Disconnected:
                    if (newState.reason === DCReason.WebSocketClose && newState.closeCode === 4014) {
                        entersState(this.connection, Status.Connecting, 3_000)
                            .then(() => {
                                this.emit('voiceConnectionMove', this.oldVoiceID, this.connection.joinConfig.channelId);
                                this.oldVoiceID = this.connection.joinConfig.channelId;
                            })
                            .catch(error => void this.emit('voiceConnectionKick', this.connection.joinConfig.channelId));
                    } else if (this.connection.rejoinAttempts < 5) {
                        await wait(++this.connection.rejoinAttempts * 3_000);
                        this.connection.rejoin();
                    } else {
                        this.connection.destroy();
                        this.emit('error', new Error("connection_error"));
                    }
                    break;
                case Status.Connecting:
                case Status.Signalling:
                    if (this.readyLock) return;
                    this.readyLock = true;
                    await entersState(this.connection, Status.Ready, 20_000)
                        .then(() => this.readyLock = false)
                        .catch(error => {
                            if (this.connection.state.status !== Status.Destroyed) {
                                this.connection.destroy();
                                this.emit('error', new Error("connection_error"));
                            }
                            this.readyLock = false;
                        });
                    break;
            }
        });
    }

    /**
     * The {@link AudioPlayer} attached to the voice connection (if any).
     */
    public get player() {
        return (this.connection.state as VoiceConnectionReadyState)?.subscription?.player;
    }

    /**
     * Toggle self-deafening of the bot.
     * @returns `true` if self-deafened, otherwise `false` i.e. self-undeafened.
     */
    public toggleDeafen() {
        const flag = this.connection.joinConfig.selfDeaf;
        this.connection.joinConfig.selfDeaf = !flag;
        this.connection.rejoin(this.connection.joinConfig);
        this.emit('selfDeafen', !flag);
        return !flag;
    }

    /**
     * Toggle self-muting of the bot.
     * @returns `true` if self-muted, otherwise `false` i.e. self-unmuted.
     */
    public toggleMute() {
        const flag = this.connection.joinConfig.selfMute;
        this.connection.joinConfig.selfMute = !flag;
        this.connection.rejoin(this.connection.joinConfig);
        this.emit('selfMute', !flag);
        return !flag;
    }

    /**
     * Destroys the voice connection, making it unable to be reused again.
     */
    public destroy() {
        try { this.connection.destroy(); } catch { }
    }

}