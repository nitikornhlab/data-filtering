import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/user/:id')
  getCustomSales(@Param('id') id): Promise<string> {
    return this.appService.getCustomSalesNormalRaw('/user/:id', id);
  }

  @Get('/join/:id')
  getJoinSales(@Param('id') id) {
    return this.appService.getJoinSales('/join/:id', id);
  }
}
