import React, { useState, useEffect } from "react";
import ServiceCard from "../ServiceCard";

import { setCurrServices } from "../../../features/adminSlice";

const HotelServices = ({ allServices, setIsOpen, fetchedOptions }) => {
  const [servicesToRender, setServicesToRender] = useState([]);
  const [fetchedOptionsToRender, setFetchedOptionsToRender] = useState([]);

  useEffect(() => {
    const result = allServices?.reduce((acc, cur) => {
      const category = cur.category.categoryName;
      const service = {
        _id: cur._id,
        hotelServiceName: cur.hotelServiceName,
      };

      if (!acc[category]) {
        acc[category] = {
          category,
          services: [service],
        };
      } else {
        acc[category].services.push(service);
      }

      return acc;
    }, {});

    const arrayResult = result ? Object.values(result) : [];

    if (allServices) setServicesToRender(arrayResult);
  }, [allServices]);

  useEffect(() => {
    const result = fetchedOptions?.reduce((acc, cur) => {
      const category = cur?.category?.categoryName;
      const service = {
        _id: cur._id,
        hotelServiceName: cur?.hotelServiceName,
        label: cur?.hotelServiceName,
        value: cur?._id,
      };

      if (!acc[category]) {
        acc[category] = {
          category,
          services: [service],
        };
      } else {
        acc[category]?.services?.push(service);
      }

      return acc;
    }, {});

    const arrayResult = result ? Object.values(result) : [];

    if (fetchedOptions) setFetchedOptionsToRender(arrayResult);
  }, [fetchedOptions]);

  return (
    <div className="add_more-col categ-col shadowed_box">
      <div className="gen_title">Услуги отеля</div>
      {servicesToRender?.length > 0
        ? servicesToRender?.map((serv, idx) => {
            return (
              <ServiceCard
                key={serv._id}
                setIsOpen={setIsOpen}
                number={idx + 1}
                editMode
                allServices={allServices}
                setCurrServices={setCurrServices}
                necCategory={serv.category}
                necServices={serv.services.map((el) => {
                  return {
                    ...el,
                    label: el.hotelServiceName,
                    value: el._id,
                  };
                })}
                fetchedOptions={
                  fetchedOptionsToRender?.filter(
                    (service) => service.category === serv.category
                  )[0]?.services
                }
              />
            );
          })
        : null}
    </div>
  );
};

export default HotelServices;
