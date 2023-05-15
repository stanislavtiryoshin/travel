import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import HotelSearch from "../../components/SearchPanel/HotelSearch";
import Section from "../../components/Section";
import Filter from "../../components/Filter/Filter";
import DashHotelCard from "../../components/HotelCard/DashHotelCard";
import { useNavigate } from "react-router-dom";
import { getCamps } from "../../features/camps/campSlice";

const CampRes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { camps, isLoading } = useSelector((state) => state.camps);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
    dispatch(getCamps());
  }, []);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="tours_tab tab">
      <HotelSearch campMode />
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
