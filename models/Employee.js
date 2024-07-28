import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

function generateId() {
  return uuidv4().slice(0, 6);
}

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  id: {
    type: String,
    default: generateId,
    unique: true,
    minlength: 6,
    maxlength: 6,
  },
});

export const Employee = mongoose.model('Employee', employeeSchema);
