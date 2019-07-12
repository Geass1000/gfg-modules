import { ProfileComponent } from './profile.component';
import * as Gfg from '../../core';

@Gfg.Module({
    imports: [],
    providers: [ ProfileComponent ],
})
export class ProfileModule {}