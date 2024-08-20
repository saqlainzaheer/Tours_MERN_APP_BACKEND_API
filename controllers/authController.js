import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import crypto from 'crypto';
import { catchAsync } from './errorController.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { sendPasswordResetEmail } from '../utils/email.js';

//genrating web token
export const jwt_sign = (id) => {
  const payload = { id };
  const secretKey = process.env.JWT_SECRET_KEY;
  const options = { expiresIn: process.env.JWT_EXPIRATION };

  return jwt.sign(payload, secretKey, options);
};
//sign up
export const signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  const token = jwt_sign(newUser._id);

  res.status(200).json({
    status: true,
    token: token,
    data: newUser,
  });
});
//sign in

export const signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('email and password required', 401);
  }

  const user = await User.findOne({ email: email }).select('+password');

  if (!user || !(await user.comparePasswords(password, user.password))) {
    throw new AppError('email or password incorrect!!');
  }
  user.password = undefined;
  const token = jwt_sign(user._id);
  res.status(200).json({
    status: 'success',
    token: token,
    data: user,
  });
});

//protecting routes

export const protect = catchAsync(async (req, res, next) => {
  //get token check if is it there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Authorization token missing !!!!!', 401));
  }

  //2verification token
  const verifyToken = (token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      return decoded;
    } catch (error) {
      next(
        new AppError(
          `Token verification failed: Login Again ${error.message}`,
          401
        )
      );
    }
  };
  const decode_payload = verifyToken(token);
  //check user still exist

  const user = await User.findById(decode_payload.id).select('+password');
  if (!user) {
    next(
      new AppError('User associated with current token not found....  ', 401)
    );
  }
  //check if user change password after token has bee issued

  if (user.changePasswordAfter(decode_payload.iat)) {
    return next(
      new AppError('User change Password please login Again...', 401)
    );
  }

  req.user = user;
  next();
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log(roles, req.user.role);
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You have not permession to do this action ', 403)
      );
    }
    next();
  };
};

export const forgetPassword = catchAsync(async (req, res, next) => {
  // Validate email
  const { email } = req.body;
  if (!email) {
    return next(new AppError('Email is required', 400));
  }

  // Check if a user with the provided email exists
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError('No user found with that email address', 401));
  }

  // Generate a reset token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Encrypt the token and set it to the user's resetPasswordToken field
  const encryptedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  user.resetPasswordToken = encryptedToken;

  // Set the token expiration time (10 minutes from now)
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

  // Save the user with the updated reset token and expiration time
  await user.save({ validateBeforeSave: false });

  // Send the password reset email
  try {
    await sendPasswordResetEmail(user.email, resetToken);
    res.status(200).json({
      status: 'success',
      message: 'Password reset token sent to email!',
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
});

//reset password
export const resetPassword = catchAsync(async (req, res, next) => {
  const { token, newPassword, confirmPassword } = req.body;

  // Validate input
  if (!token || !newPassword || !confirmPassword) {
    return next(
      new AppError('Token and new password and confirmpass are required', 400)
    );
  }

  // Hash the provided token
  const hashedToken = crypto
    .createHash('sha256')
    .update(token) // Use the correct variable name
    .digest('hex');

  // Find the user with the hashed reset token
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() }, // Ensure token has not expired
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  // Hash the new password
  user.password = newPassword;
  user.confirmPassword = confirmPassword;
  // //user.passwordChangeAt = Date.now() - 1000; // Set password change time
  user.resetPasswordToken = undefined; // Clean up reset fields
  user.resetPasswordExpires = undefined;

  await user.save(); // Save the updated user

  res.status(200).json({
    status: 'success',
    message: 'Password has been successfully updated',
  });
});
