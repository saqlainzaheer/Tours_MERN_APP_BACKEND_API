import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        // Simple regex for basic email validation
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: 'Please provide a valid email',
    },
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false, // Do not return the password in queries
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on SAVE and CREATE, not on UPDATE
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords do not match',
    },
  },
  passwordChangeAt: {
    type: Date,
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'guest'],
    default: 'user',
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

// Mongoose pre-save hook to hash the password before saving it
userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangeAt = Date.now() - 1000;
  // Delete confirmPassword field
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.comparePasswords = async (
  userInputPassword,
  storedHashedPassword
) => {
  try {
    const result = await bcrypt.compare(
      userInputPassword,
      storedHashedPassword
    );
    return result;
  } catch (err) {
    throw new Error('Error comparing passwords', err.message);
  }
};

userSchema.methods.changePasswordAfter = function (jwtTimeStamp) {
  if (this.passwordChangeAt) {
    const milliseconds = parseInt(this.passwordChangeAt.getTime() / 1000, 10);

    return jwtTimeStamp < milliseconds; // Compare JWT timestamp to password change timestamp
  }
};

const User = mongoose.model('User', userSchema);

export default User;
