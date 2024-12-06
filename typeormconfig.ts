// @ts-nocheck
import { registerAs } from '@nestjs/config';
import { Report } from './src/reports/report.entity';
import { User } from './src/users/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv-flow';

dotenvConfig();

const config: DataSourceOptions = {
  database: process.env.DB_NAME,
  type: process.env.DB_TYPE,
  synchronize: process.env.DB_SYNC === 'true',
  entities: [User, Report],
  migrations: [__dirname + '/dist/src/migrations/*{.ts,.js}'],
  migrationsRun: process.env.DB_MIGRATIONS_RUN === 'true',
};
export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
