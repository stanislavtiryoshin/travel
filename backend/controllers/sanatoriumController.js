const Sanatorium = require("../models/sanatoriumModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Room = require("../models/roomModel");
const Period = require("../models/periodModel");
const Food = require("../models/foodModel");
const Excursion = require("../models/excursionModel");
const { isDateInRange } = require("../dateUtils");

const addSanatorium = async (req, res) => {
  const post = await Sanatorium.create(req.body);
  res.status(200).json(post);
};

//@desc   Update sanatorium
//@route  PATCH /api/sanatoriums/:sanatoriumId
//@access Private

const updateSanatorium = asyncHandler(async (req, res) => {
  const hotel = await Sanatorium.findByIdAndUpdate(
    req.params.sanatoriumId,
    req.body,
    {
      new: true,
    }
  )
    .populate("locationId")
    .populate("rooms")
    .populate("sanatoriumProgram.programId")
    .populate("food.foodType")
    .populate("periods")
    .populate({
      path: "rooms",
      populate: {
        path: "periodPrices.period",
        model: "Period",
      },
    })
    .populate({
      path: "sanatoriumServices.serviceType",
      populate: {
        path: "category",
        model: "Category",
      },
    });
  res.status(200).json(hotel);
});

//@desc   Get sanatoriums
//@route  GET /api/sanatoriums
//@access Private

const getSanatoriums = (req, res) => {
  const { locationId } = req.query;
  const query = {};

  if (locationId && locationId != "") {
    query.locationId = locationId;
  }

  Sanatorium.find()
    .populate("locationId")
    .populate("sanatoriumProgram.programId")
    .then((response) => res.status(200).json(response))
    .catch((err) => res.sendStatus(403));
};

// TODO: Спросить у Стаса | спросил? не помню
const getAdminSanatoriums = (req, res) => {
  const { name, locationId, minAge } = req.query;
};

//@desc   Get single sanatorium
//@route  GET /api/sanatoriums/:sanatoriumId
//@access Public

const getSingleSanatorium = asyncHandler(async (req, res) => {
  let query = Sanatorium.findById(req.params.sanatoriumId)
    .populate("locationId")
    .populate("rooms")
    .populate("sanatoriumProgram.programId")
    .populate("food.foodType")
    .populate("periods")
    .populate({
      path: "rooms",
      populate: {
        path: "periodPrices.period",
        model: "Period",
      },
    })
    .populate({
      path: "sanatoriumServices.serviceType",
      populate: {
        path: "category",
        model: "Category",
      },
    });

  if (req.query.agesArray) {
    query = query.populate({
      path: "rooms",
      match: {
        $expr: {
          $gte: [
            {
              $sum: [
                "$capacity",
                {
                  $size: {
                    $filter: {
                      input: "$extraPlaces",
                      as: "extraPlace",
                      cond: { $ne: ["$$extraPlace.isBabyPlace", true] },
                    },
                  },
                },
              ],
            },
            { $size: req.query.agesArray },
          ],
        },
      },
    });
  }

  const singleSanatorium = await query.exec();
  res.status(200).json(singleSanatorium);
});

//@desc   Calculate the price of hotel
//@route  GET /api/hotels/:hotelId/price
//@access Public

const getPrice = asyncHandler(async (req, res) => {
  const {
    addRoomFood,
    addExtraFood,
    start,
    daysAmount,
    agesArray,
    sanatoriumId,
    roomId,
    personMode,
    excursionsArray,
    kidsFoodAmount,
    adultsFoodAmount,
  } = req.query;

  let ages = agesArray.split(",").map(Number);
  let excursions = [];

  if (excursionsArray && excursionsArray.length > 0)
    excursions = excursionsArray?.split(",");

  console.log(excursions);

  const hotel = await Sanatorium.findById(sanatoriumId).populate({
    path: "rooms",
    populate: {
      path: "periodPrices.period",
      model: "Period",
    },
  });
  const chosenRoom = hotel.rooms.find((room) => room._id == roomId);

  let sum = 0;
  let roomSum = 0;
  let extraPlacesSum = 0;
  let excursionsSum = 0;
  let foodSum = 0;
  let chosenPlaces = [];

  // const extraPlacesAmount = ages.length - chosenRoom.capacity;

  // console.log(extraPlacesAmount, "extraPlacesAmount");

  // let placesArray = chosenRoom.extraPlaces;

  ages.sort((a, b) => b - a);

  // const accomodatedAges = ages.splice(0, chosenRoom.capacity);

  // console.log(ages, "ages");

  // const notChosen = (place) => !chosenPlaces.some((el) => el._id === place._id);

  // ages.forEach((age) => {
  //   const matchingPlace = placesArray.find((place) => {
  //     if (age !== 1000 && notChosen(place)) {
  //       return true;
  //     } else if (age === 1000 && !place.isKid && notChosen(place)) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   });
  //   if (matchingPlace) {
  //     chosenPlaces.push(matchingPlace);
  //   }
  // });

  // console.log(chosenPlaces);

  // sum = chosenPlaces.reduce((acc, place) => {
  //   if (addExtraFood !== "false" && !chosenRoom.extraFoodIncluded) {
  //     console.log("addExtraFood");
  //     return acc + (place.priceNoFood + place.foodPrice) * daysAmount;
  //   } else if (addExtraFood !== "true" && !chosenRoom.extraFoodIncluded) {
  //     console.log("!addExtraFood");
  //     return acc + place.priceNoFood * daysAmount;
  //   } else if (chosenRoom.extraFoodIncluded) {
  //     console.log("extra food already included");
  //     return acc + place.priceWithFood * daysAmount;
  //   }
  // }, 0);

  // extraPlacesSum = chosenPlaces.reduce((acc, place) => {
  //   if (addExtraFood !== "false" && !chosenRoom.extraFoodIncluded) {
  //     console.log("addExtraFood");
  //     return acc + (place.priceNoFood + place.foodPrice) * daysAmount;
  //   } else if (addExtraFood !== "true" && !chosenRoom.extraFoodIncluded) {
  //     console.log("!addExtraFood");
  //     return acc + place.priceNoFood * daysAmount;
  //   } else if (chosenRoom.extraFoodIncluded) {
  //     console.log("extra food already included");
  //     return acc + place.priceWithFood * daysAmount;
  //   }
  // }, 0);

  async function calculatePrice(start, daysNum, basePrice, pricesArray) {
    let daysArray = [];
    const startingDate = new Date(+start);

    for (let i = 0; i < daysNum; i++) {
      let date = new Date(startingDate.getTime());
      date.setDate(startingDate.getDate() + i);
      daysArray.push(date);
    }

    const findPriceByDate = (date) => {
      if (pricesArray && pricesArray.length > 0) {
        let priceFound = false;
        pricesArray.forEach((el) => {
          const startMonth = el.period.startMonth;
          const startDay = el.period.startDay;
          const endMonth = el.period.endMonth;
          const endDay = el.period.endDay;

          if (
            (date.getMonth() + 1 > startMonth ||
              (date.getMonth() + 1 === startMonth &&
                date.getDate() >= startDay)) &&
            (date.getMonth() + 1 < endMonth ||
              (date.getMonth() + 1 === endMonth && date.getDate() <= endDay))
          ) {
            if (!personMode) {
              sum += el.roomPrice;
              roomSum += el.roomPrice;
              console.log("sum += el.roomPrice");
              priceFound = true;
            } else {
              accomodatedAges.forEach((age) => {
                if (age === 1000) {
                  sum += el.adultPrice;
                  roomSum += el.roomPrice;
                  console.log("sum += el.adultPrice");
                } else {
                  sum += el.kidPrice;
                  roomSum += el.roomPrice;
                  console.log("sum += el.kidPrice;");
                }
              });
              priceFound = true;
            }
          }
        });
        if (!priceFound) {
          res.status(404).json("Could not find period for these dates");
        }
      } else {
        res.status(404).json("This room has no prices set");
      }
      console.log(sum);
    };

    for (let i = 0; i < daysNum; i++) {
      findPriceByDate(daysArray[i]);
    }

    // (function calculateFood() {
    //   if (addRoomFood && kidsFoodAmount !== 0 && adultsFoodAmount !== 0) {
    //     for (let i = 0; i < daysAmount; i++) {
    //       for (let i = 0; i < kidsFoodAmount; i++) {
    //         sum += hotel.kidFoodPrice;
    //         foodSum += hotel.kidFoodPrice;
    //         console.log("kid food");
    //       }
    //       for (let i = 0; i < adultsFoodAmount; i++) {
    //         sum += hotel.adultFoodPrice;
    //         foodSum += hotel.adultFoodPrice;
    //         console.log("adult food");
    //       }
    //     }
    //   }
    // })();

    // async function calculateExcursionPrices() {
    //   if (excursions && excursions.length > 0) {
    //     for (const id of excursions) {
    //       const excursion = await Excursion.findById(id);
    //       if (excursion && excursion.price) {
    //         sum += excursion.price * agesArray.split(",").length;
    //         excursionsSum += excursion.price * agesArray.split(",").length;
    //       }
    //     }
    //   }
    // }

    // if (excursions && excursions.length > 0) {
    //   await calculateExcursionPrices();
    // }
  }

  await calculatePrice(start, daysAmount, 2, chosenRoom.periodPrices);

  res.status(200).json({
    sum: sum * 1.1,
    margeSum: 0.1 * sum,
    // extraPlacesSum: extraPlacesSum,
    // excursionsSum: excursionsSum,
    roomSum: roomSum,
    // foodSum: foodSum,
    // kidsFoodAmount: kidsFoodAmount,
    // adultsFoodAmount: adultsFoodAmount,
  });
});

// Get rooms with limit

const getRoomsByLimit = async (req, res) => {
  const { limit, capacity } = req.query;
  const { sanatoriumId } = req.params;
  let roomData = [];

  try {
    const sanatorium = await Sanatorium.findOne({ _id: sanatoriumId });

    try {
      const rooms = await Room.aggregate([
        {
          $match: {
            _id: {
              $in: sanatorium.rooms,
            },
            $expr: {
              $gte: [
                {
                  $sum: [
                    "$capacity",
                    {
                      $size: {
                        $filter: {
                          input: "$extraPlaces",
                          as: "extraPlace",
                          cond: { $ne: ["$$extraPlace.isBabyPlace", true] },
                        },
                      },
                    },
                  ],
                },
                parseInt(capacity),
              ],
            },
          },
        },
      ]);
      res.status(200).json(rooms);
    } catch (error) {
      res.status(500).json(error);
    }

    console.log(roomData);
  } catch (err) {
    res.sendStatus(404);
  }
};

//@desc   Get searched sanatoriums
//@route  GET /api/sanatoriums/searched
//@access Public

const getSearchedSanatoriums = asyncHandler(async (req, res) => {
  const {
    agesArray,
    daysAmount,
    startDate,
    locationId,
    adultsAmount,
    kidsAmount,
    dashMode,
    searchNameId,
  } = req.query;

  const peopleAmount = agesArray.length;

  const calculatePrice = (start, daysNum, basePrice, pricesArray) => {
    let daysArray = [];
    const startingDate = new Date(+start);

    for (let i = 0; i < daysNum; i++) {
      let date = new Date(startingDate.getTime());
      date.setDate(startingDate.getDate() + i);
      daysArray.push(date);
    }

    let sum = 0;

    const findPriceByDate = (date) => {
      if (pricesArray && pricesArray.length > 0) {
        let priceFound = false;
        pricesArray.forEach((el) => {
          const startMonth = el.period.startMonth;
          const startDay = el.period.startDay;
          const endMonth = el.period.endMonth;
          const endDay = el.period.endDay;

          if (isDateInRange(date, startMonth, startDay, endMonth, endDay)) {
            sum += el.roomPrice;
            priceFound = true;
          }
        });
        if (!priceFound) {
          sum += basePrice;
        }
      } else {
        sum += basePrice;
      }
    };

    for (let i = 0; i < daysNum; i++) {
      findPriceByDate(daysArray[i]);
    }

    return sum;
  };

  let query = {};

  if (locationId && locationId !== "") {
    query.locationId = locationId;
  }

  if (searchNameId && searchNameId !== "") {
    query = {
      ...query,
      $or: [
        { uid: searchNameId }, // Match by ID
        { name: { $regex: searchNameId, $options: "i" } }, // Match by name
      ],
    };
  }

  let adminSanatoriums;
  if (dashMode && dashMode !== "false") {
    adminSanatoriums = await Sanatorium.find(query);
    return res.status(200).json(adminSanatoriums);
  }

  let hotels = await Sanatorium.find(query)
    .populate("locationId")
    .populate({
      path: "food",
      populate: {
        path: "food.foodType",
        model: "Food",
      },
    })
    .populate("rooms")
    .populate({
      path: "rooms",
      populate: {
        path: "periodPrices.period",
        model: "Period",
      },
      match: {
        $expr: {
          $gte: ["$capacity", peopleAmount],
        },
      },
    })
    .populate({
      path: "sanatoriumServices.serviceType",
      populate: {
        path: "category",
        model: "Category",
      },
    });

  hotels = hotels.filter((hotel) => hotel.rooms.length > 0);

  const newHotels = hotels.map((hotel) => {
    const newHotel = hotel.toObject();
    const rooms = newHotel.rooms;
    const cheapestRoom = rooms.reduce(
      (prev, curr) =>
        prev.periodPrices[0].roomPrice < curr.periodPrices[0].roomPrice
          ? prev
          : curr,
      rooms[0]
    );
    console.log(cheapestRoom?.roomName);
    const basePrice = cheapestRoom?.roomPrice;
    const pricesArray = cheapestRoom?.periodPrices;

    const costOfStay = calculatePrice(
      startDate,
      daysAmount,
      basePrice,
      pricesArray
    );

    if (cheapestRoom && cheapestRoom.discount && cheapestRoom.discount !== 0) {
      newHotel.totalPrice = (costOfStay * (100 - cheapestRoom.discount)) / 100;
      newHotel.oldPrice = costOfStay;
    } else if (cheapestRoom) {
      newHotel.totalPrice = costOfStay;
    } else {
      newHotel.totalPrice = 22800;
    }

    return {
      ...newHotel,
      daysAmount: +daysAmount,
      nightsAmount: daysAmount - 1,
      adultsAmount: +adultsAmount,
      kidsAmount: +kidsAmount,
    };
  });

  res.status(200).send(newHotels);
});

module.exports = {
  getSingleSanatorium,
  getSanatoriums,
  addSanatorium,
  getPrice,
  getRoomsByLimit,
  getSearchedSanatoriums,
  updateSanatorium,
  // TODO!: Спросить
  // getAdminSanatoriums,
};
