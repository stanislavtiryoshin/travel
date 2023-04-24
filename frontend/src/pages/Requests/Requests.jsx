import React, { useMemo } from "react";

import style from "./Requests.module.scss";
import HotelSearch from "../../components/SearchPanel/HotelSearch";
import RequestTable from "./RequestTable";
import { useSelector } from "react-redux";
import {
  useGetOrdersQuery,
  useUpdateStatusMutation,
} from "../../features/services/base.service";

const Requests = () => {
  const { user } = useSelector((state) => state.auth);

  const { data: orders = [], isLoading } = useGetOrdersQuery(user.token);

  const [updateStatus] = useUpdateStatusMutation();

  const statuses = [
    {
      label: "В обработке",
      style: "req-status",
    },
    {
      label: "Отклонено",
      style: "den-status",
    },
    {
      label: "Оплачено",
      style: "paid-status",
    },
    {
      label: "На паузе",
      style: "pause-status",
    },
  ];

  const handleUpdate = (id, status) => {
    const values = {
      id,
      status,
    };
    updateStatus(values);
  };

  const columns = useMemo(
    () => [
      {
        id: "checkbox",
        header: "Checkbox",
        Cell: ({ row }) => (
          <input
            type="checkbox"
            value={row.original._id}
            onChange={(e) => console.log(e.target.value)}
          />
        ),
      },
      {
        id: "uid",
        header: "Order ID",
        accessor: "uid",
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
        Cell: ({ row }) => <button className="order-btn">Открыть заказ</button>,
      },
      {
        id: "status",
        header: "Статус",
        accessor: "status",
        Cell: ({ row }) => (
          <button
            className={`${
              statuses.filter((stat) =>
                stat.label.includes(row.original.status)
              )[0].style
            } status-btn`}
          >
            {row.original.status}
          </button>
        ),
      },
      {
        id: "changeStatus",
        header: "Изменить статус",
        Cell: ({ row }) => (
          <>
            <select
              className="status-select"
              onChange={(e) => handleUpdate(row.original._id, e.target.value)}
            >
              {statuses.map((stat) => (
                <option
                  key={stat.label}
                  value={stat.label}
                  className={stat.style}
                  selected={stat.label === row.original.status}
                >
                  {stat.label}
                </option>
              ))}
            </select>
          </>
        ),
      },
    ],
    []
  );

  return (
    <>
      <HotelSearch reqMode />

      <section className="dash_section">
        {isLoading ? (
          <div className="table-loader">Загрузка заявок...</div>
        ) : (
          <RequestTable columns={columns} data={orders} />
        )}
      </section>
    </>
  );
};

export default Requests;
