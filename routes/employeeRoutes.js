import express from 'express';

import { createEmployees } from '../controllers/employeeController.js';

const router = express.Router();

router.route('/multiple').post(createEmployees); //store multiple employees

export default router;
