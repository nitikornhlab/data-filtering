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
      originalResult: await this.connection.query(query),
      originalQuery: query,
      filteredResult: await this.connection.query(queryWithFilter),
      filteredQuery: queryWithFilter,
    };
  }

  async getCustomSalesWithOrder(api: string, id): Promise<any> {
    const query = `SELECT * FROM CustomSales 
    ORDER BY OrderId 
    OFFSET 1 ROWS
    FETCH NEXT 10 ROWS ONLY`;
    const userContext: userContext = {
      orgId: 'org1',
      roles: ['USER', 'ADMIN'],
      userId: id,
      department: 'D1',
    };
    const queryWithFilter = this.getFilterData(query, userContext, api);
    return {
      originalResult: await this.connection.query(query),
      originalQuery: query,
      filteredResult: await this.connection.query(queryWithFilter),
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
      originalResult: await this.connection.query(query),
      originalQuery: query,
      filterdResult: await this.connection.query(queryWithFilter),
      filteredQuery: queryWithFilter,
    };
  }

  getFilterData(
    query: string | QueryBuilder<string>,
    userContext: userContext,
    api: string,
  ): any {
    let rawSql: string;
    let orderAndLimitSql = '';
    if (typeof query === 'string') {
      rawSql = query;
    } else {
      rawSql = query.getSql();
    }
    let querySql = rawSql;

    const findOrderBy = rawSql.lastIndexOf('ORDER BY');
    if (findOrderBy > 0) {
      querySql = rawSql.substring(0, findOrderBy);
      orderAndLimitSql = rawSql.substring(findOrderBy);
    }

    querySql = this.addFilterString(querySql, userContext, api);
    return querySql + ' ' + orderAndLimitSql;
  }

  addFilterString(
    query: string,
    userContext: userContext,
    api: string,
  ): string {
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
