import express from 'express';
import {
  createTour,
  // deleteTour,
  getAllTours,
  getTourStats,
  getCheapTour,
  getTour,
  updateTour,
} from '../controllers/tourController.js';

const router = express.Router();

router.route('/').get(getAllTours).post(createTour);
router.route('/cheap-tours').get(getCheapTour, getAllTours);

router.route('/tour-stats').get(getTourStats);

router.route('/:id').get(getTour).patch(updateTour);

export default router;
