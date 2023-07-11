import { useEffect, useState } from "react";
import {
  useGetCategoryQuery,
  useGetFoodQuery,
  useGetLocationQuery,
  useGetServicesQuery,
} from "../../features/services/base.service";

export function useFetchedData() {
  const [fetchedData, setFetchedData] = useState({
    allServices: [],
    allLocations: [],
    allCategories: [],
    allFoods: [],
  });

  const { data: allServices } = useGetServicesQuery();
  const { data: allFoods } = useGetFoodQuery();
  const { data: allCategories } = useGetCategoryQuery();
  const { data: allLocations } = useGetLocationQuery();

  useEffect(() => {
    setFetchedData((prevData) => ({
      ...prevData,
      allServices: allServices || prevData.allServices,
      allFoods: allFoods || prevData.allFoods,
      allCategories: allCategories || prevData.allCategories,
      allLocations: allLocations || prevData.allLocations,
    }));
  }, [allServices, allFoods, allCategories, allLocations]);

  return fetchedData;
}
