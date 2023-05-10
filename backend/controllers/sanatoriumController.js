const Sanatorium = require("../models/sanatoriumModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const addSanatorium = async (req, res) => {
  const post = await Sanatorium.create(req.body);
  res.status(200).json(post);
};

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
    hotelId,
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

  const hotel = await Sanatorium.findById(hotelId)
    .populate("locationId")
    .populate("food")
    .populate({
      path: "rooms",
      populate: {
        path: "periodPrices.period",
        model: "Period",
      },
    })
    .populate({
      path: "hotelServices",
      populate: {
        path: "category",
        model: "Category",
      },
    });
  const chosenRoom = hotel.rooms.find((room) => room._id == roomId);

  let sum = 0;
  let extraPlacesSum = 0;
  let roomSum = 0;
  let excursionsSum = 0;
  let chosenPlaces = [];

  const extraPlacesAmount = ages.length - chosenRoom.capacity;

  console.log(extraPlacesAmount, "extraPlacesAmount");

  let placesArray = chosenRoom.extraPlaces;

  ages.sort((a, b) => b - a);

  const accomodatedAges = ages.splice(0, chosenRoom.capacity);

  console.log(ages, "ages");

  const notChosen = (place) => !chosenPlaces.some((el) => el._id === place._id);

  ages.forEach((age) => {
    const matchingPlace = placesArray.find((place) => {
      if (age !== 1000 && notChosen(place)) {
        return true;
      } else if (age === 1000 && !place.isKid && notChosen(place)) {
        return true;
      } else {
        return false;
      }
    });
    if (matchingPlace) {
      chosenPlaces.push(matchingPlace);
    }
  });

  console.log(chosenPlaces);

  sum = chosenPlaces.reduce((acc, place) => {
    if (addExtraFood !== "false" && !chosenRoom.extraFoodIncluded) {
      console.log("addExtraFood");
      return acc + (place.priceNoFood + place.foodPrice) * daysAmount;
    } else if (addExtraFood !== "true" && !chosenRoom.extraFoodIncluded) {
      console.log("!addExtraFood");
      return acc + place.priceNoFood * daysAmount;
    } else if (chosenRoom.extraFoodIncluded) {
      console.log("extra food already included");
      return acc + place.priceWithFood * daysAmount;
    }
  }, 0);

  extraPlacesSum = chosenPlaces.reduce((acc, place) => {
    if (addExtraFood !== "false" && !chosenRoom.extraFoodIncluded) {
      console.log("addExtraFood");
      return acc + (place.priceNoFood + place.foodPrice) * daysAmount;
    } else if (addExtraFood !== "true" && !chosenRoom.extraFoodIncluded) {
      console.log("!addExtraFood");
      return acc + place.priceNoFood * daysAmount;
    } else if (chosenRoom.extraFoodIncluded) {
      console.log("extra food already included");
      return acc + place.priceWithFood * daysAmount;
    }
  }, 0);

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

    (function calculateFood() {
      if (addRoomFood && kidsFoodAmount !== 0 && adultsFoodAmount !== 0) {
        for (let i = 0; i < daysAmount; i++) {
          for (let i = 0; i < kidsFoodAmount; i++) {
            sum += hotel.kidFoodPrice;
            console.log("kid food");
          }
          for (let i = 0; i < adultsFoodAmount; i++) {
            sum += hotel.adultFoodPrice;
            console.log("adult food");
          }
        }
      }
    })();

    async function calculateExcursionPrices() {
      if (excursions && excursions.length > 0) {
        for (const id of excursions) {
          const excursion = await Excursion.findById(id);
          if (excursion && excursion.price) {
            sum += excursion.price * agesArray.split(",").length;
            excursionsSum += excursion.price * agesArray.split(",").length;
          }
        }
      }
    }

    if (excursions && excursions.length > 0) {
      await calculateExcursionPrices();
    }
  }

  await calculatePrice(start, daysAmount, 2, chosenRoom.periodPrices);

  res.status(200).json({
    sum: sum * 1.1,
    margeSum: 0.1 * sum,
    extraPlacesSum: extraPlacesSum,
    excursionsSum: excursionsSum,
    roomSum: roomSum,
  });
});

//@desc   Get single sanatorium
//@route  GET /api/sanatoriums/:sanatoriumId
//@access Public

const getSingleSanatorium = (req, res) => {
  Sanatorium.findById(req.params.sanatoriumId)
    .populate("locationId")
    .populate("rooms")
    .populate("sanatoriumProgram.programId")
    .populate("food.foodType")
    .populate({
      path: "sanatoriumServices.serviceType",
      populate: {
        path: "category",
        model: "Category",
      },
    })
    .then((response) => res.status(200).json(response))
    .catch((err) => res.sendStatus(403));
};

module.exports = {
  getSingleSanatorium,
  getSanatoriums,
  addSanatorium,
  // TODO!: Спросить
  // getAdminSanatoriums,
};
