import { LoggerService } from './../core/logger.service';
import { HttpService } from './../core/http.service';
import * as Gfg from '../../core';

@Gfg.Injectable()
export class ProfileComponent {
  constructor (
    private logger: LoggerService,
    private http: HttpService
  ) {}

  public helloWorld () {  }

  private pHelloWorld () {  }
}
