import express from 'express';
import { signUp } from '../controllers/authController.js';

const router = express.Router();

router.route('/signup').post(signUp);

// import { checkID } from '../controllers/tourController';

// router.param('id', checkID);

// router.route('/').get(getAllUsers).post(createUser);

// router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;
