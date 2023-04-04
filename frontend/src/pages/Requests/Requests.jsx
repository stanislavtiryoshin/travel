import React, { useMemo } from "react";

import style from "./Requests.module.scss";
import HotelSearch from "../../components/SearchPanel/HotelSearch";
import RequestTable from "./RequestTable";
import { useSelector } from "react-redux";
import { useGetOrdersQuery } from "../../features/services/base.service";

const Requests = () => {
  const { user } = useSelector((state) => state.auth);

  const { data: orders, isLoading } = useGetOrdersQuery(user.token);

  const columns = useMemo(
    () => [
      {
        id: "order_id",
        header: "Order ID",
        accessor: "_id",
      },
      {
        id: "name",
        header: "Имя",
        accessor: "clientName",
      },
      {
        id: "phone",
        header: "Номер телефона",
        accessor: "clientPhone",
      },
      {
        id: "email",
        header: "Электронная почта",
        accessor: "clientEmail",
      },
      {
        id: "dateOfRequest",
        header: "Дата заявки",
        Cell: ({ row }) => {
          const date = new Date(+row.original.startDate);
          return date.toLocaleString(undefined, {
            month: "numeric",
            day: "numeric",
            year: "numeric",
          });
        },
      },
      {
        id: "category",
        header: "Категория",
      },
      {
        id: "details",
        header: "Подробности",
        Cell: ({ row }) => <button>Открыть заказ</button>,
      },
      {
        id: "status",
        header: "Статус",
        accessor: "status",
      },
    ],
    []
  );

  return (
    <>
      <div className={style.search}>
        <HotelSearch reqMode />
      </div>

      <section className="dash_section">
        {isLoading ? (
          <div>LOADING...</div>
        ) : (
          <RequestTable columns={columns} data={orders} />
        )}
      </section>
    </>
  );
};

export default Requests;
