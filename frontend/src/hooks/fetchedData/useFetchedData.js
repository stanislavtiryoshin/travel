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

  const { data: allServices, isLoading: servicesIsLoading } =
    useGetServicesQuery();
  const { data: allFoods } = useGetFoodQuery();
  const { data: allCategories } = useGetCategoryQuery();
  const { data: allLocations } = useGetLocationQuery();

  useEffect(() => {
    if (allServices)
      setFetchedData({ ...fetchedData, allServices: allServices });
    if (allFoods) setFetchedData({ ...fetchedData, allFoods: allFoods });
    if (allCategories)
      setFetchedData({ ...fetchedData, allCategories: allCategories });
    if (allLocations)
      setFetchedData({ ...fetchedData, allLocations: allLocations });
  }, [allServices, allFoods, allCategories, allLocations]);

  return [fetchedData, setFetchedData];
}
