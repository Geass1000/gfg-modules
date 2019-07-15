import { LoggerService } from './core/logger.service';
import { AppService } from './app.service';
import * as Gfg from '../core';

@Gfg.Injectable({
  providers: [LoggerService]
})
export class AppComponent {
  private hi: string = `asd`;
  constructor (
    // @Gfg.Inject(`Hello!`) private hello: string,
    private logger: LoggerService,
    private appService: AppService
  ) { }

  public helloWorld () {  }

  private pHelloWorld () {  }
}
