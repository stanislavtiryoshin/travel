import { useState } from "react";
import ShortUniqueId from "short-unique-id";

export default function useHotelData() {
  const uid = new ShortUniqueId({
    dictionary: "number", // the default
    length: 6,
  });

  const [hotelData, setHotelData] = useState({
    uid: uid(),
    hotelServices: [],
    locationId: null,
    name: "",
    locationFeature: "",
    mapLink: "",
    rating: null,
    description: "",
    enterTime: "07:00",
    leaveTime: "07:00",
    food: null,
    kidFoodPrice: null,
    adultFoodPrice: null,
    kids: {
      babyMaxAge: null,
      kidMaxAge: null,
      kidDiscount: {
        discountType: "В тенге",
        discountValue: 2000,
      },
    },
    payment: {
      paymentType: "",
      prepayment: null,
    },
    comforts: [],
    hotelStars: 5,
    marge: 0,
  });

  return [hotelData, setHotelData];
}
