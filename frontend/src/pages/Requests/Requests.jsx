import React, { useMemo } from "react";

import { Link } from "react-router-dom";
import HotelSearch from "../../components/SearchPanel/HotelSearch";
import RequestTable from "./RequestTable";
import { useSelector } from "react-redux";
import {
  useLazyGetOrdersByQueryQuery,
  useUpdateStatusMutation,
  useLazyGetOrderByIdQuery,
  useLazyGetHotelByIdQuery,
} from "../../features/services/base.service";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader";
import { API_URL_PROXY } from "../../config/config";
import axios from "axios";

const Requests = () => {
  const { user } = useSelector((state) => state.auth);

  // const { data: orders = [], isLoading } = useGetOrdersQuery(user.token);
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [getOrder] = useLazyGetOrderByIdQuery();
  const [getHotelName] = useLazyGetHotelByIdQuery();
  const [order, setOrder] = React.useState(null);
  const [hotelName, setHotelName] = React.useState("");

  const [orders, setOrders] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [orderIsLoading, setOrderIsLoading] = React.useState(true);
  const [fetchOrders, { isFetching }] = useLazyGetOrdersByQueryQuery();

  const [updateStatus] = useUpdateStatusMutation();

  React.useEffect(() => {
    fetchOrders({
      token: user?.token,
      query: query,
      status: status,
    })
      .then(({ data }) => setOrders(data))
      .then(() => setIsLoading(false));
  }, [orders]);

  // console.log(orders);

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

  const handleSendStatus = (status, email, uid) => {
    axios
      .post(`${API_URL_PROXY}/send-status-email`, {
        status: status,
        uid: uid,
        email: email,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUpdate = (id, status, orderObj) => {
    const values = {
      id,
      status,
    };
    updateStatus(values).then(({ data }) => {
      const orderIndex = orders.findIndex((order) => order._id === data._id);
      const newOrders = [
        ...orders.slice(0, orderIndex),
        { ...orders[orderIndex], status: data.status },
        ...orders.slice(orderIndex + 1),
      ];
      setOrders(newOrders);

      if (orderObj) {
        handleSendStatus(status, orderObj.clientEmail, orderObj.uid);
        console.log(status, orderObj.clientEmail, orderObj.uid, "order email");
      }
    });

    // console.log("test ");
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
        accessor: "mode",
        Cell: ({ row }) => {
          return (
            <Link className="categ_link" to={`/hotels/${row.original.hotel}`}>
              {row.original.mode}
            </Link>
          );
        },
      },
      {
        id: "details",
        header: "Подробности",
        Cell: ({ row }) => (
          <button
            onClick={() => {
              setOrderIsLoading(true);
              getOrder(row.original._id)
                .then(({ data }) => {
                  setOrder(data);
                  getHotelName(data?.hotel).then((hotelName) => {
                    setHotelName(hotelName?.data?.name);
                    setOrderIsLoading(false);
                  });
                })
                .finally(() => {
                  setIsOpen(true);
                });
            }}
            className="order-btn"
          >
            Открыть заказ
          </button>
        ),
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
              )[0]?.style
            } status-btn`}
          >
            {/* {row.original.status} */}
            <select
              className="status-select"
              onChange={(e) => {
                handleUpdate(row.original._id, e.target.value, row.original);
                console.log(row.original, "id");
              }}
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
          </button>
        ),
      },
    ],
    []
  );

  const handleSearch = () => {
    fetchOrders({
      token: user && user?.token,
      query: query,
      status: status,
    })
      .then(({ data }) => {
        setIsLoading(true);
        setOrders(data);
      })
      .finally(() => setIsLoading(false));
  };

  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <HotelSearch
        mode="request"
        reqMode
        handleQuery={setQuery}
        handleStatus={setStatus}
        find={handleSearch}
        query={query}
      />

      <section className="dash_section">
        {isFetching ? (
          <Loader />
        ) : (
          <RequestTable columns={columns} data={orders} />
        )}
      </section>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        {orderIsLoading ? (
          <Loader />
        ) : (
          <div style={{ lineHeight: "1.5" }}>
            <h2>Заказ №{order?.uid}</h2>
            <div className="order-details">
              <div className="order-details__item">
                <h3>Имя</h3>
                <p>{order?.clientName}</p>
              </div>
              <div className="order-details__item">
                <h3>Номер телефона</h3>
                <p>{order?.clientPhone}</p>
              </div>
              <div className="order-details__item">
                <h3>Электронная почта</h3>
                <p>{order?.clientEmail}</p>
                <div className="order-details__item">
                  <h3>Название отеля</h3>
                  <p>{hotelName}</p>
                </div>
              </div>
              <div className="order-details__item">
                <h3>Дата заявки</h3>
                <p>
                  {new Date(+order?.startDate).toLocaleString(undefined, {
                    month: "numeric",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="order-details__item">
                <h3>Количество людей</h3>
                <p>{order?.peopleAmount}</p>
              </div>
              <div className="order-details__item">
                <h3>Дополнительная информация</h3>
                <p>{order?.extraInfo}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default Requests;
