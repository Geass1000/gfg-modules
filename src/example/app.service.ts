import { LoggerService } from './core/logger.service';
import * as Gfg from '../core';

@Gfg.Injectable()
export class AppService {

    constructor (private logger: LoggerService) {  }
}

