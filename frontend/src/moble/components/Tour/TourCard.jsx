import React from "react";
import { useGetTourQuery } from "../../../features/services/base.service";
import Loader from "../Loader/Loader";
import Card from "../Layout/Card";

const Tour = () => {
  const { data, isLoading, isSuccess } = useGetTourQuery();

  if (isLoading) {
    return <Loader />;
  }
  if (isSuccess)
    return (
      <>
        {data.map((tour) => (
          <Card
            rating={tour.rating}
            stars={tour.rating}
            name={tour.name}
            locationFeature={`${tour.locationFeature}, ${
              tour.locationId && tour.locationId.locationName
                ? tour.locationId.locationName
                : ""
            }`}
          />
        ))}
      </>
    );
};

export default Tour;
