import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTours } from "../../features/tour/tourSlice";
import HotelSearch from "../../components/SearchPanel/HotelSearch";
import Section from "../../components/Section";
import Filter from "../../components/Filter/Filter";
import DashHotelCard from "../../components/HotelCard/DashHotelCard";
import Loader from "../../components/Loader";

const TourRes = () => {
  const { tours, isLoading } = useSelector((state) => state.tour);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
    dispatch(getTours());
  }, [dispatch]);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="tours_tab tab">
      <HotelSearch tourMode />
      <Section section="dash_section" wrapper="dash_wrapper">
        <div className="dash_side">
          <Filter tourMode />
        </div>
        <div className="dash_main">
          {tours && tours.length > 0
            ? tours?.map((tour, idx) => {
                return (
                  <DashHotelCard hotel={tour} key={tour._id} mode="tour" />
                );
              })
            : "is loading"}
        </div>
      </Section>
    </div>
  );
};

export default TourRes;
