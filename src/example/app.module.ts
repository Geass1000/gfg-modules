import { HomeComponent } from './home.component';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { AppComponent } from './app.component';
import * as Gfg from '../core';
import { ProfileModule } from './profile/profile.module';

@Gfg.Module({
    imports: [ CoreModule, ProfileModule ],
    providers: [ AppService, HomeComponent, AppComponent ],
})
export class AppModule {}