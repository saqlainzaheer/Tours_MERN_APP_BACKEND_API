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
import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router();

router
  .route('/')
  .get(protect, restrictTo('admin'), getAllTours)
  .post(createTour);

router.route('/cheap-tours').get(getCheapTour, getAllTours);

router.route('/tour-stats').get(getTourStats);

router.route('/:id').get(getTour).patch(updateTour);

export default router;
