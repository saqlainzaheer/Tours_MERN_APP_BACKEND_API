import { Employee } from '../models/Employee.js';

export const createEmployees = async (req, res) => {
  try {
    const employees = await Employee.insertMany(req.body, { ordered: true });

    res.status(200).json({
      success: true,
      status: 200,
      result: 'employeee',
      message: 'Employees Added Successfully',
      data: {
        employees,
      },
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
