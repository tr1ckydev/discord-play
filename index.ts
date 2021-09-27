import { AudioPlayerStatus } from '@discordjs/voice';
import { search, video_basic_info, yt_validate } from 'play-dl';
import { TypedEmitter } from 'tiny-typed-emitter';
import { Connection, ConnectionEvents } from './src/connection.js';
import { DisPlayEvent } from './src/eventEnums.js';
import { Player, PlayerEvents } from './src/player.js';
import { createTrackResource } from './src/track.js';

interface Options {
    /**
     * (Optional) The cookies to play age-restricted videos.
     */
    cookies?: string,
    /**
     * Sets the quality of streams.
     */
    quality: "LOWEST" | "MEDIUM" | "HIGHEST",
    /**
     * Defines the behaviour of what should happen after the queue array becomes empty.
     * 
     * CONNECTION_KEEP - Continues to remain in the voice channel.
     * 
     * CONNECTION_DESTROY - Leaves the voice channel.
     */
    emptyQueueBehaviour: "CONNECTION_KEEP" | "CONNECTION_DESTROY"
}

/**
 * The interface of objects stored in queue array
 */
interface Enqueue {
    /**
     * The video title for the track.
     */
    title: string,
    /**
     * The video url for the track.
     */
    url: string,
    /**
     * The name of channel of the track video.
     */
    artist: string,
    /**
     * The id of the user who added the track to the playlist.
     */
    addedBy: string
}

interface DiscordPlayEvents extends ConnectionEvents, PlayerEvents { }

/**
 * Initializes the Connection, Player.
 * Re-exports all the events to be directly emitted from here,
 * and not from the modules itself, for easier event handling.
 */
export class DiscordPlay extends TypedEmitter<DiscordPlayEvents>{
    public connection: Connection;
    public player: Player;
    private cookies: string | undefined;
    public queue: Enqueue[] = [];
    public options: Options;
    private songLoop = false;
    /** 
     * @param voice The voice channel object
     * @param options Various options to configure DiscordPlay
     */
    constructor(voice: any, options: Options) {
        super();
        this.options = options;
        this.connection = new Connection(voice);
        this.player = new Player(voice.guild.id);
        this.cookies = options?.cookies;
        ["voiceConnectionCreate", "voiceConnectionMove", "voiceConnectionKick", "voiceConnectionDestroy", "selfDeafen", "selfMute", "error"].forEach(eventName => {
            // @ts-ignore
            this.connection.on(eventName, (arg1, arg2) => this.emit(eventName, arg1, arg2));
        });
        ["audioPlayerBuffer", "audioPlayerStart", "audioPlayerPause", "audioPlayerResume", "audioPlayerAutoPause", "error"].forEach(eventName => {
            // @ts-ignore
            this.player.on(eventName, (arg1, arg2) => this.emit(eventName, arg1, arg2));
        });
        this.player.on("audioPlayerFinish", (arg1, arg2) => {
            this.emit("audioPlayerFinish", arg1, arg2);
            if (!this.songLoop) this.queue.shift();
            this.processQueue();
        });
    }
    /**
     * Enqueues the track from the args provided.
     * @param args The terms to be searched. (Can be terms or a youtube url)
     */
    public async enqueue(args: string): Promise<Enqueue> {
        let details;
        switch (yt_validate(args)) {
            case "video":
                details = (await video_basic_info(args, this.cookies)).video_details;
                break;
            default:
                details = (await search(args, { limit: 1 }))![0];
                break;
        }
        // @ts-ignore
        const track: Enqueue = { title: details.title, url: details.url!, artist: details.channel?.name };
        this.queue.push(track);
        this.processQueue();
        return track;
    }
    /**
     * 
     */
    public skip(): void {
        this.player.stop();
    }
    /**
     * 
     */
    public stop(): void {
        this.player.stop();
        this.connection.destroy();
    }
    /**
     * 
     */
    public toggleSongLoop(): boolean {
        return this.songLoop = !this.songLoop;
    }
    /**
     * Processes the queue and executes behaviour.
     */
    private processQueue(): void {
        if (!this.queue.length) {
            switch (this.options.emptyQueueBehaviour) {
                case "CONNECTION_KEEP": break;
                case "CONNECTION_DESTROY": this.connection.destroy(); break;
            }
            return;
        }
        if (this.player.player.state.status !== AudioPlayerStatus.Idle) return;
        createTrackResource(this.queue[0].url, this.cookies)
            .then(resource => void this.player.player.play(resource))
            .catch(error => this.emit('error', error));
    }
}

export { Connection as DisPlayConnection, Player as DisPlayPlayer, DisPlayEvent };