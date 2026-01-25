// src/db/connection.js
import mysql from "mysql2/promise";
import 'dotenv/config';

export const db = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

console.log({
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME
});


