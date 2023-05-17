import React, { useEffect } from "react";

import { useGetManagersQuery } from "../../features/services/user.service";
import Loader from "../../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Manager from "../Manager/Manager";

const ManagersRes = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { data: managers, isLoading, isFetching } = useGetManagersQuery();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
    if (user.role !== "Admin") {
      navigate("/dashboard/requests");
    }
  }, []);

  if (isLoading) {
    return <Loader />;
  }
  console.log(managers, "managers in managersRes");

  return (
    <div className="reqs_tab tab">
      <Manager isLoading={isFetching} users={managers} />
    </div>
  );
};

export default ManagersRes;
