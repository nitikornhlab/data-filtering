import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/user/querybuilder/:id')
  getCustomSalesByQueryBuilder(@Param('id') id): Promise<string> {
    return this.appService.getCustomSalesWithQueryBuilder('/user/:id', id);
  }

  @Get('/user/:id')
  getCustomSales(@Param('id') id): Promise<string> {
    return this.appService.getCustomSalesNormalRaw('/user/:id', id);
  }

  @Get('/join/querybuilder/:id')
  getJoinSalesByQueryBuilder(@Param('id') id) {
    return this.appService.getJoinSalesQueryBuilder('/join/:id', id);
  }

  @Get('/join/:id')
  getJoinSales(@Param('id') id) {
    return this.appService.getJoinSales('/join/:id', id);
  }

  @Get('/orderBy/querybuilder/:id')
  getCustomSalesWithOrderAndQueryBuilder(@Param('id') id): Promise<string> {
    return this.appService.getCustomSalesWithOrderAndQueryBuilder(
      '/user/:id',
      id,
    );
  }

  @Get('/orderBy/:id')
  getCustomSalesWithOrder(@Param('id') id): Promise<string> {
    return this.appService.getCustomSalesWithOrder('/user/:id', id);
  }
}
