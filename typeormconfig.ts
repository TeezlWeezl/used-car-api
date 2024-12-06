import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { Report } from './src/reports/report.entity';
import { User } from './src/users/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });

const config = {
  type: 'sqlite',
  database: 'db.sqlite',
  synchronize: false,
  entities: [User, Report],
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
