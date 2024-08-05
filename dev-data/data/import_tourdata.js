import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { Tour } from '../../models/Tour.js';

dotenv.config();
const __dirname = path.resolve();
const DB = process.env.DATABASE;
const dbUser = process.env.NODE_ENV;

mongoose
  .connect(DB)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch((err) => console.log('MongoDB connection failed:', err));

console.log(`Connecting to database at ${DB} with user ${dbUser}`);
const tours = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, 'dev-data/data/tours-simple.json'),
    'utf-8'
  )
);

const import_tour = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded');
  } catch (err) {
    console.log(err);
  }
};
const delete_tour = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted');
  } catch (err) {
    console.log(err);
  }
  // process.end();
};

if (process.argv[2] === '--import') {
  import_tour();
} else if (process.argv[2] === '--delete') {
  delete_tour();
}
