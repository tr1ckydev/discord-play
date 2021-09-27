import { AudioResource, createAudioResource } from '@discordjs/voice';
import { stream } from 'play-dl';

export function createTrackResource(url: string, cookies: string | undefined): Promise<AudioResource> {
    return new Promise(async (resolve, reject) => {
        try {
            const probe = await stream(url, { cookie: cookies });
            const resource = createAudioResource(probe.stream, { inputType: probe.type });
            resolve(resource);
        } catch (error) { reject(error); }
    });
}