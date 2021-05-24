import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): Promise<string> {
    return this.appService.getHello();
  }

  @Get('/2')
  async get2(): Promise<string> {
    return await this.appService.get2();
  }

  // different user example https://docs.microsoft.com/en-us/sql/relational-databases/security/row-level-security?view=sql-server-ver15#MidTier
  @Get('/user/1')
  async getUser1() {
    return await this.appService.getUser(1);
  }

  @Get('/user/2')
  async getUser2() {
    return await this.appService.getUser(2);
  }
  @Get('/users')
  async getAllUser() {
    return await this.appService.getUser();
  }
}
