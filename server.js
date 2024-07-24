import { app } from './app.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const DB = process.env.DATABASE;
const dbUser = process.env.NODE_ENV;

mongoose
  .connect(DB)
  .then((con) => console.log('Mongo db connected successfully!'));
console.log(`Connecting to database at {dbHost} with user ${dbUser}`);

app.listen(3000, () => {
  console.log('Listening from port 3000....');
});
