import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';

//  Imitate from https://github.com/FelipeTaiarol/multi_tenancy_pg_row_level_security/blob/master/src/tenantAwareQueryBuilder.ts
@Injectable()
export class AppService {
  async getHello(): Promise<string> {
    // get a connection and create a new query runner
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    return await getConnection().transaction(
      async (transactionalEntityManager) => {
        const delay = (ms) => new Promise((res) => setTimeout(res, ms));

        try {
          const result = await queryRunner.manager.query(
            `EXEC sys.sp_set_session_context @key = N'language', @value = ${Math.random()};`,
          );
          await delay(5000);
          return result;
        } finally {
          await queryRunner.manager.query(
            `EXEC sys.sp_set_session_context 'language', null`,
          );
          // you need to release query runner which is manually created:
          await queryRunner.release();
        }
      },
    );
    // try {
    //   const result = await queryRunner.manager.query(
    //     `EXEC sys.sp_set_session_context @key = N'language', @value = ${Math.random()};`,
    //   );
    //   await delay(5000);
    //   return result;
    // } finally {
    //   await queryRunner.manager.query(
    //     `EXEC sys.sp_set_session_context 'language', null`,
    //   );
    //   // you need to release query runner which is manually created:
    //   await queryRunner.release();
    // }
  }

  async get2(): Promise<string> {
    // get a connection and create a new query runner
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    return await getConnection().transaction(
      async (transactionalEntityManager) => {
        try {
          const result = await queryRunner.manager.query(
            ` SELECT SESSION_CONTEXT(N'language') as language;   `,
          );
          return result;
        } finally {
          // you need to release query runner which is manually created:
          await queryRunner.release();
        }
      },
    );
  }

  async getUser(userId?: number) {
    // get a connection and create a new query runner
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    let query: string;
    if (typeof userId !== 'undefined') {
      query = `EXECUTE AS USER = 'AppUser';  
      EXEC sp_set_session_context @key=N'UserId', @value=${userId};  
      SELECT * FROM Sales;  `;
    } else {
      query = ` SELECT * FROM Sales;  `;
    }
    try {
      const result = await queryRunner.manager.query(query);
      return result;
    } finally {
      await queryRunner.manager.query(
        `EXEC sys.sp_set_session_context 'UserId', null`,
      );
      // you need to release query runner which is manually created:
      await queryRunner.release();
    }
  }
}
