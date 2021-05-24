import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';

//  Imitate from https://github.com/FelipeTaiarol/multi_tenancy_pg_row_level_security/blob/master/src/tenantAwareQueryBuilder.ts
@Injectable()
export class AppService {
  async getHello(): Promise<string> {
    // get a connection and create a new query runner
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    try {
      const result = await queryRunner.manager.query(
        `EXEC sys.sp_set_session_context @key = N'language', @value = ${Math.random()};`,
      );
      return result;
    } finally {
      await queryRunner.manager.query(
        `EXEC sys.sp_set_session_context 'language', null`,
      );
      // you need to release query runner which is manually created:
      await queryRunner.release();
    }
  }

  async get2(): Promise<string> {
    // get a connection and create a new query runner
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    try {
      const result = await queryRunner.manager.query(
        ` SELECT SESSION_CONTEXT(N'language') as language;   `,
      );
      return result;
    } finally {
      // you need to release query runner which is manually created:
      await queryRunner.release();
    }
  }
}
