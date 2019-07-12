import { AuthService } from './auth.service';

import * as Gfg from '../../../core';

@Gfg.Module({
    imports: [],
    providers: [ AuthService ],
})
export class AuthModule {}