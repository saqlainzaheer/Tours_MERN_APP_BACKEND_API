import express from 'express';
import tourRouter from './routes/tourRoutes.js';

export const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send({
    status: 'success',
    data: 'asdasd',
  });
});

app.use('/api/v1/tours', tourRouter);
