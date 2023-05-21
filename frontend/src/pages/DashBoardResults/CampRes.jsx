import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import HotelSearch from "../../components/SearchPanel/HotelSearch";
import Section from "../../components/Section";
import Filter from "../../components/Filter/Filter";
import DashHotelCard from "../../components/HotelCard/DashHotelCard";
import { useNavigate } from "react-router-dom";
import { getCamps } from "../../features/camps/campSlice";
import { useLazyGetSanatoriumsByFilterQuery } from "../../features/services/filter.service";
import Loader from "../../components/Loader";

const CampRes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { searchData } = useSelector((state) => state.search);
  const { camps } = useSelector((state) => state.camps);

  // console.log(startDate, "startdate");

  const [searchCamps, { isLoading: sanatoriumsIsLoading }] =
    useLazyGetSanatoriumsByFilterQuery();

  const [filterData, setSanatoriumFilterData] = useState();
  useEffect(() => {
    searchCamps(searchData).then(({ data }) => {
      dispatch(setSanatoriumFilterData(data));
    });
  }, []);

  if (sanatoriumsIsLoading) return <Loader />;
  return (
    <div className="tours_tab tab">
      <HotelSearch mode="camp" />
      <Section section="dash_section" wrapper="dash_wrapper">
        <div className="dash_side">
          <Filter campMode />
        </div>
        <div className="dash_main">
          {camps && camps.length > 0
            ? camps?.map((camp, idx) => {
                return (
                  <DashHotelCard hotel={camp} key={camp._id} mode="camp" />
                );
              })
            : "is loading"}
        </div>
      </Section>
    </div>
  );
};

export default CampRes;
