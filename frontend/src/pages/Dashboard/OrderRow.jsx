import React from "react";
import { useDispatch } from "react-redux";
import { editOrder } from "../../features/order/orderSlice";

const OrderRow = ({
  index,
  amount,
  days,
  startDate,
  endDate,
  name,
  location,
  room,
  sum,
  status,
}) => {
  const dispatch = useDispatch();
  const handleStatusChange = () => {
    dispatch(editOrder({ status: "Выполнено" }));
  };
  return (
    <div className="order_row">
      <div className="order_col">{index + 1}</div>
      <div className="order_col">{name}</div>
      <div className="order_col">{location}</div>
      <div className="order_col">
        {startDate}-{endDate}
      </div>
      <div className="order_col">{days}</div>
      <div className="order_col">{amount} взр.</div>
      <div className="order_col">{sum} тг.</div>
      {/* <div className="order_col" onClick={handleStatusChange}>
        {status}
      </div> */}
    </div>
  );
};

export default OrderRow;
