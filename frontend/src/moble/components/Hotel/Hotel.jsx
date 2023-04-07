import React from "react";
import { useGetHotelsQuery } from "../../../features/services/base.service";
import Loader from "../Loader/Loader";
import Card from "../Layout/Card";

const Hotel = () => {
  const { data, isLoading, isSuccess } = useGetHotelsQuery();

  if (isLoading) {
    return <Loader />;
  }
  if (isSuccess)
    return (
      <>
        {data.map((hotel) => (
          <Card
            name={hotel.name}
            stars={hotel.hotelStars}
            locationFeature={`${hotel.locationFeature}, ${
              hotel.locationId && hotel.locationId.locationName
                ? hotel.locationId.locationName
                : ""
            }`}
            rating={hotel.rating}
          />
        ))}
      </>
    );
};

export default Hotel;
