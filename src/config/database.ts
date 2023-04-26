import * as dotenv from 'dotenv';
import { config } from 'mssql';

dotenv.config();

let config : config = {
    server: process.env.DB_HOST!,
    database: process.env.DB_NAME,
    authentication: {
      type: 'default',
      options: {
        userName: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
      }
    },
    options: {
      encrypt: false,
    }
};

export { config };