import { StreamType } from '@discordjs/voice';

/** 
 * The options available while trying to play an audio resource. 
 */
export interface PlayOptions {
    /**
     * If not specified, `StreamType.Arbitrary` will be used
     * else the specified stream type.
     */
    streamType?: StreamType;
    /**
     * If not specified, the resource will be created with inline volume `off`.
     * If any value was provided, the resource gets created with inline volume `on`
     * and then the volume of the resource gets set to the value provided.
     */
    volume?: number;
}