import * as Gfg from '../core';
import { Inject } from '../core';

import { LoggerService } from './core/logger.service';
import { HttpService } from './core/http.service';

@Gfg.Injectable()
export class AppService {
  @Inject(LoggerService)
  private megaLogger: any;

  constructor (
    private logger: LoggerService,
    @Inject(HttpService) private http: number,
  ) { }
}

