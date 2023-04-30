import { useState, useEffect } from "react";

import RequestTable from "../Requests/RequestTable";
import HotelSearch from "../../components/SearchPanel/HotelSearch";

import Loader from "../../components/Loader";

const Manager = () => {
  const [fakeManagers, setFakeManagers] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((json) => {
        setFakeManagers(json);
        setIsLoading(false);
      });
  }, []);

  const columns = [
    {
      id: "checkbox",
      header: "checkbox",
      Cell: ({ row }) => (
        <input
          type="checkbox"
          value={row.original.id}
          onChange={(e) => console.log(e.target.value)}
        />
      ),
    },
    {
      id: "id",
      header: "ID",
      accessor: "id",
    },
    {
      id: "name",
      header: "Имя",
      accessor: "name",
    },
    {
      id: "email",
      header: "Email",
      accessor: "email",
    },
    {
      id: "phone",
      header: "Телефон",
      accessor: "phone",
    },
  ];

  return (
    <>
      <HotelSearch reqMode />

      <section
        className="dash_section"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {isLoading ? (
          <Loader />
        ) : (
          <RequestTable columns={columns} data={fakeManagers} isManager />
        )}
      </section>
    </>
  );
};

export default Manager;
