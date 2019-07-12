import { LoggerService } from './../logger.service';
import * as Gfg from '../../../core';

@Gfg.Injectable({
    providers: [ LoggerService ],
})
export class AuthService {
}

