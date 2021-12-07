import { StreamType } from '@discordjs/voice';

/** 
 * The options available while trying to play an audio resource. 
 */
export interface PlayOptions {
    /**
     * Type of input stream - {@link StreamType}.
     * 
     * If not specified, `StreamType.Arbitrary` will be used
     * else the specified stream type.
     */
    streamType?: StreamType;
    /**
     * Percentage of volume to set (0 to 100).
     * @remarks
     * If not specified, the resource will be created with inline volume `off`,
     * else the resource gets created with inline volume `on`
     * and then the volume of the resource gets set to the value provided.
     */
    volume?: number;
}