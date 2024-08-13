import express from 'express';
import { signIn, signUp } from '../controllers/authController.js';

const router = express.Router();

router.route('/signup').post(signUp);
router.route('/signin').post(signIn);

// import { checkID } from '../controllers/tourController';

// router.param('id', checkID);

// router.route('/').get(getAllUsers).post(createUser);

// router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;
