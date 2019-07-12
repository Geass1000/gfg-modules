import { AuthModule } from './auth/auth.module';
import { HttpService } from './http.service';
import { LoggerService } from './logger.service';
import * as Gfg from '../../core';

@Gfg.Global()
@Gfg.Module({
  imports: [AuthModule],
  providers: [LoggerService, HttpService],
})
export class CoreModule { }