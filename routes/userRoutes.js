import express from 'express';
import {
  forgetPassword,
  protect,
  resetPassword,
  signIn,
  signUp,
} from '../controllers/authController.js';
import { updateUser } from '../controllers/userController.js';

const router = express.Router();

router.route('/signup').post(signUp);
router.route('/signin').post(signIn);

router.route('/forgetpassword').post(forgetPassword);
router.route('/restpassword').post(resetPassword);

// router.route('/restPassword').post(resetPassword);

// import { checkID } from '../controllers/tourController';

// router.param('id', checkID);

// router.route('/').get(getAllUsers).post(createUser);

// router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

router.route('/updateuser').patch(protect, updateUser);
export default router;
