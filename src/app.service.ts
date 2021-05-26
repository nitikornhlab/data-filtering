import { Injectable } from '@nestjs/common';
import { Connection, QueryBuilder } from 'typeorm';
import { dbConditionFilter } from './customDb';

@Injectable()
export class AppService {
  constructor(private connection: Connection) {}
  getHello(): string {
    return 'Hello World!';
  }

  async getCustomSalesNormalRaw(api: string, id): Promise<any> {
    const query = 'SELECT * FROM CustomSales';
    const userContext: userContext = {
      orgId: 'org1',
      roles: ['USER', 'ADMIN'],
      userId: id,
      department: 'D1',
    };
    const queryWithFilter = this.getFilterData(query, userContext, api);
    return {
      result: await this.connection.query(queryWithFilter),
      originalQuery: query,
      filteredQuery: queryWithFilter,
    };
  }

  async getJoinSales(api: string, id): Promise<any> {
    const query = `
    SELECT s.Product, f.OrderId, s.Salesrep, f.Qty  FROM Sample.Sales f
    INNER JOIN Sample.Lk_Salesman_Product s
    ON s.Product = f.Product`;
    const userContext: userContext = {
      orgId: 'org1',
      roles: ['USER'],
      userId: id,
      department: 'D1',
    };
    const queryWithFilter = this.getFilterData(query, userContext, api);

    return {
      result: await this.connection.query(queryWithFilter),
      originalQuery: query,
      filteredQuery: queryWithFilter,
    };
  }

  getFilterData(
    query: string | QueryBuilder<string>,
    userContext: userContext,
    api: string,
  ): any {
    if (typeof query === 'string') {
      query = this.addFilterString(query, userContext, api);
    } else {
      query = this.addFilterString(query.getSql(), userContext, api);
    }
    return query;
  }

  addFilterString(
    query: string,
    userContext: userContext,
    api: string,
  ): string {
    console.log(query, userContext, api);
    const queryAliasTable = 'query';
    let queryWithFilterBuilder = this.connection
      .createQueryBuilder()
      .select('*')
      .from('(' + query + ')', queryAliasTable);

    // query  with role
    for (let i = 0; i < userContext.roles.length; i++) {
      const whereCondition = dbConditionFilter.filter(
        (filter) => userContext.roles[i] === filter.role && api === filter.api,
      );
      console.log(whereCondition, 'where');

      // not found condition to filter (with specific role & api) In DB
      if (whereCondition.length === 0) {
        continue;
      }

      if (i === 0) {
        // first role add where to main querybuilder
        whereCondition.map((where, index) => {
          console.log('first roles map');
          const whereQuery = `${queryAliasTable}.${where.filterWithColumn}= '${
            userContext[where.compareWith]
          }'`;
          if (index === 0) {
            console.log('where query ', whereQuery);
            queryWithFilterBuilder = queryWithFilterBuilder.where(whereQuery);
          } else {
            queryWithFilterBuilder =
              queryWithFilterBuilder.andWhere(whereQuery);
          }
        });
      } else {
        // 2,3,4,... role add where to temporary querybuilder before add it to main querybuilder
        let tempWhere = '';
        whereCondition.map((where, index) => {
          const whereQuery = `${queryAliasTable}.${where.filterWithColumn}= '${
            userContext[where.compareWith]
          }'`;

          if (index === 0) {
            tempWhere = whereQuery;
          } else {
            tempWhere += `AND ${whereQuery}`;
          }
        });
        queryWithFilterBuilder = queryWithFilterBuilder.orWhere(
          `(${tempWhere})`,
        );
      }
    }
    return queryWithFilterBuilder.getSql();
  }
}
export class userContext {
  roles: string[];
  orgId: string;
  userId: string;
  department: string;
}
