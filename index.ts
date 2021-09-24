import { createAudioResource } from '@discordjs/voice';
import { search, stream, stream_from_info, validate, video_info, yt_validate } from 'play-dl';
import { Video } from 'play-dl/dist/YouTube/classes/Video';
import { TypedEmitter } from 'tiny-typed-emitter';
import { Connection, ConnectionEvents } from './src/connection';
import { DisPlayEvent } from './src/eventEnums';
import { Player, PlayerEvents } from './src/player';

interface Options {
    /**
     * (Optional) The cookies to play age-restricted videos.
     */
    cookies?: string,
    /**
     * 
     */
    retryLimit?: number,
}
interface Enqueue {
    /**
     * The video title for the track.
     */
    title: string,
    /**
     * The video url for the track.
     */
    url: string | undefined,
    /**
     * The name of channel of the track video.
     */
    artist: string
}
interface DiscordPlayEvents extends ConnectionEvents, PlayerEvents { }

export class DiscordPlay extends TypedEmitter<DiscordPlayEvents>{
    public connection: Connection;
    public player: Player;
    private cookies: string | undefined;
    public queue: Enqueue[] = [];
    /**
     * 
     * @param voice 
     * @param options 
     */
    constructor(voice: any, options?: Options) {
        super();
        this.connection = new Connection(voice);
        this.player = new Player(voice.guild.id);
        this.cookies = options?.cookies;
        ["voiceConnectionCreate", "voiceConnectionMove", "voiceConnectionKick", "voiceConnectionDestroy", "selfDeafen", "selfMute", "error"].forEach(eventName => {
            // @ts-ignore
            this.connection.on(eventName, (arg1, arg2) => this.emit(eventName, arg1, arg2));
        });
        ["audioPlayerBuffer", "audioPlayerStart", "audioPlayerFinish", "audioPlayerPause", "audioPlayerResume", "audioPlayerAutoPause", "error"].forEach(eventName => {
            // @ts-ignore
            this.player.on(eventName, (arg1, arg2) => this.emit(eventName, arg1, arg2));
        });
    }
    /**
     * Enqueues the track from the args provided.
     * @param args 
     */
    public async enqueue(args: string): Promise<Enqueue> {
        let probe, details;
        switch (yt_validate(args)) {
            case "video": {
                details = await video_info(args, this.cookies);
                probe = await stream_from_info(details);
                details = details.video_details;
                break;
            }
            default: {
                details = (await search(args, { limit: 1 }))[0] as Video;
                probe = await stream(details.url as string, this.cookies);
                break;
            }
        }
        const resource = createAudioResource(probe.stream, { inputType: probe.type });
        this.player.player.play(resource);
        const track: Enqueue = { title: details.title, url: details.url, artist: details.channel?.name };
        this.queue.push(track);
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
        this
    }
    private processQueue(): void {
        if (!this.queue.length) return;


    }
}

function createTrackResource(volume, args, hq) {
    return new Promise(async (resolve, reject) => {
        let probe;
        try {
            if (validate(args[0]) !== false) probe = await stream(args[0]);
            else probe = await stream((await search(args.join(' '), { limit: 1 }))[0].url);
            const resource = createAudioResource(probe.stream, { inputType: probe.type, inlineVolume: !hq });
            if (!hq) resource.volume?.setVolume(volume);
            resolve(resource);
        } catch (error) { reject(error); }
    });
}
export { Connection as DisPlayConnection, Player as DisPlayPlayer, DisPlayEvent };