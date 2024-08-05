import express from 'express';
import tourRouter from './routes/tourRoutes.js';
import employeeRouter from './routes/employeeRoutes.js';

export const app = express();
app.use(express.json());

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/employee', employeeRouter);
