import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { SportsArticle } from './entity/SportsArticle';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'sports_articles',
  synchronize: true,
  logging: false,
  entities: [SportsArticle],
});
