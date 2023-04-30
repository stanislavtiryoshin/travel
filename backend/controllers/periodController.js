const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const Period = require("../models/periodModel");
const { Hotel } = require("../models/hotelModel");
const Room = require("../models/roomModel");

//@desc   Get periods
//@route  GET /api/periods
//@access Public

const getPeriods = asyncHandler(async (req, res) => {
  const period = await Period.find();
  res.status(200).json(period);
});

//@desc   Add new periods
//@route  POST /api/periods
//@access Private

const addPeriod = asyncHandler(async (req, res) => {
  const { periods } = req.body;

  if (periods) {
    try {
      const newPeriods = await Promise.all(
        periods.map(async (period) => {
          let periodObj;
          if (!period._id) {
            periodObj = await Period.create(period);
            const hotel = await Hotel.findOneAndUpdate(
              { _id: periodObj.hotel },
              {
                $push: {
                  periods: periodObj,
                },
              }
            );

            if (hotel && hotel.rooms) {
              for (const room of hotel.rooms) {
                await Room.findByIdAndUpdate(room, {
                  $push: {
                    periodPrices: {
                      period: periodObj._id,
                      roomPrice: 0,
                      adultPrice: 0,
                      kidPrice: 0,
                    },
                  },
                });
              }
            }

            return periodObj;
          } else return;
        })
      );

      res.status(200).json(newPeriods);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
});

//@desc   Delete period
//@route  DELETE /api/periods
//@access Public

const deletePeriod = asyncHandler(async (req, res) => {
  const { hotelId, periodId } = req.body;
  await Period.deleteOne({ _id: periodId });
  const hotel = await Hotel.findByIdAndUpdate(hotelId, {
    $pull: {
      periods: periodId,
    },
  });
  if (hotel.rooms && hotel.rooms.length > 0) {
    try {
      for (const roomId of hotel.rooms) {
        await Room.findByIdAndUpdate(roomId, {
          $pull: {
            periodPrices: {
              period: periodId,
            },
          },
        });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  res.status(200).send("Deleted successfully");
});

//@desc   Get periods by hotel
//@route  GET /api/periods/:hotelId
//@access Public

const getPeriodsByHotel = asyncHandler(async (req, res) => {
  const period = await Period.find({ hotel: req.params.hotelId });
  res.status(200).json(period);
});

module.exports = {
  getPeriods,
  addPeriod,
  getPeriodsByHotel,
  deletePeriod,
};
