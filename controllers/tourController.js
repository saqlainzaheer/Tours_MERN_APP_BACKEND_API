// Define the path to the JSON file
// import { readFileSync } from 'fs';
// import { fileURLToPath } from 'url';
// import { dirname, join } from 'path';
// import fs from 'fs';

// // Get the directory name of the current module file
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const filePath = join(__dirname, '../dev-data/data/tours-simple.json');

// const data = readFileSync(filePath, 'utf8');
// const tours = JSON.parse(data);
// export const checkID = (req, res, next, val) => {
//   console.log(`Tour id is: ${val}`);

//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }
//   next();
// };

// export const checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price',
//     });
//   }
//   next();
// };

// export const getAllTours = (req, res) => {
//   console.log(req.requestTime);

//   res.status(200).json({
//     status: 'success',
//     requestedAt: req.requestTime,
//     results: tours.length,
//     data: {
//       tours,
//     },
//   });
// };

// export const getTour = (req, res) => {
//   console.log(req.params);
//   const id = req.params.id * 1;

//   const tour = tours.find((el) => el.id === id);

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// };

// export const createTour = (req, res) => {
//   // console.log(req.body);

//   const newId = tours[tours.length - 1].id + 1;
//   const newTour = Object.assign({ id: newId }, req.body);

//   tours.push(newTour);

//   fs.writeFile(
//     `${__dirname}/dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     (err) => {
//       res.status(201).json({
//         status: 'success',
//         data: {
//           tour: newTour,
//         },
//       });
//     }
//   );
// };

// export const updateTour = (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: '<Updated tour here...>',
//     },
//   });
// };

// export const deleteTour = (req, res) => {
//   res.status(204).send({
//     status: 'success',
//     data: null,
//   });

// import { json } from 'express';
import { ApiFeatures } from '../lib/Apifeature.js';
import { Tour } from '../models/Tour.js';
import { catchAsync } from './errorController.js';
import AppError from '../utils/AppError.js';

//cheap tour middlewear
export const getCheapTour = async (req, res, next) => {
  req.query.sort = 'price';
  req.query.limit = '5';
  next();
};

//get stats  of tours  agregation piepline

export const getTourStats = async (req, res) => {
  try {
    // Initialize ApiFeatures to handle sorting and pagination for stats
    const feature = new ApiFeatures(
      Tour.aggregate([
        { $match: { ratingsAverage: { $gte: 4.5 } } },
        {
          $group: {
            _id: '$difficulty',
            avgRating: { $avg: '$ratingsAverage' },
            avgPricee: { $avg: '$price' },
            minprice: { $min: '$price' },
            maxPrice: { $max: '$price' },
          },
        },
        // { sort:  },
      ]),
      req.query
    )
      .sort() // Apply sorting
      .pagination(); // Apply pagination

    // Retrieve aggregated statistics with applied sorting and pagination
    const stats = await feature.query;

    res.status(200).json({
      status: true,
      result: stats.length,
      data: stats,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

export const createTour = catchAsync(async (req, res) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: true,
    message: 'Tour Created Successfully',
    data: newTour,
  });
});

export const getAllTours = async (req, res) => {
  try {
    const feature = new ApiFeatures(Tour, req.query)
      .filter()
      .sort()
      .limit()
      .pagination();

    const tours = await feature.query;

    // 5. Response
    res.status(200).json({
      success: true,
      results: tours.length,
      data: { tours },
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const getTour = catchAsync(async (req, res) => {
  console.log(req.query);
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    throw new AppError('tour not find', 400);
  }
  res.status(200).json({
    success: true,
    data: tour,
  });
});

export const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: tour,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
