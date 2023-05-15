import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import HotelSearch from "../../components/SearchPanel/HotelSearch";
import Section from "../../components/Section";
import Filter from "../../components/Filter/Filter";
import DashHotelCard from "../../components/HotelCard/DashHotelCard";
import { getSanatoriums } from "../../features/sanatorium/sanatoriumSlice";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";

const SanatoriumRes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sanatoriums, isLoading } = useSelector((state) => state.sanatoriums);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
    dispatch(getSanatoriums());
  }, [dispatch]);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="tours_tab tab">
      <HotelSearch sanMode />
      <Section section="dash_section" wrapper="dash_wrapper">
        <div className="dash_side">
          <Filter sanMode />
        </div>
        <div className="dash_main">
          {sanatoriums && sanatoriums.length > 0
            ? sanatoriums?.map((sanatorium, idx) => {
                return (
                  <DashHotelCard
                    hotel={sanatorium}
                    key={sanatorium._id}
                    mode="sanatorium"
                  />
                );
              })
            : "is loading"}
        </div>
      </Section>
    </div>
  );
};

export default SanatoriumRes;
