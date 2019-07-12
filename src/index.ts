import { App } from './core/app';
import { AppModule } from './example/app.module';

App.getInstance().bootstrapModule(AppModule);