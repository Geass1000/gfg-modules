import { HomeComponent } from './home.component';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { AppComponent } from './app.component';
import * as Gfg from '../core';

@Gfg.Module({
    imports: [ CoreModule ],
    providers: [ AppService, HomeComponent, AppComponent ],
})
export class AppModule {}