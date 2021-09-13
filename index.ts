import { Connection } from './src/connection';
import { Player } from './src/player';
import { DisPlayEvent } from './src/eventEnums';

interface Options {
    limit: number,
    cookies: string,
    retryLimit: number,
}

export class DiscordPlay {
    constructor(voice: object, options: Options) {
        
    }
}

export { Connection as DisPlayConnection, Player as DisPlayPlayer, DisPlayEvent }