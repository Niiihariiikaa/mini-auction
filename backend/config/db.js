import dotenv from 'dotenv';
dotenv.config();
import { Sequelize } from 'sequelize';

if (!process.env.SUPABASE_DB_URL) {
 throw new Error('SUPABASE_DB_URL missing in .env');
 }
 const sequelize = new Sequelize(process.env.SUPABASE_DB_URL, {
 dialect: 'postgres',
 logging: false,
 });
 export default sequelize;