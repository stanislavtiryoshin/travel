import React, { useMemo } from "react";

import { useSortBy, useTable } from "react-table";
import styles from "./Requests.module.scss";
import sortButton from "./button.svg";
import trash from "./trash.svg";

const Statuses = {
  1: "Заявка",
  2: "Оплачено",
  3: "Отклонено",
  4: "На Паузе",
  5: "Завершено",
};

const fakeData = [
  {
    _id: "#876123",
    name: "Асылбек Жумабаев",
    phone: "+7 777 777 77 77",
    email: "jamesmullican@gmail.com",
    status: "Заявка",
    dateOfRequest: "12.12.2020",
    category: "Отель",
  },
  {
    _id: "#876124",
    name: "Гульнур Маматова",
    phone: "+7 777 777 77 77",
    email: "gulnur.gulnur@gmail.com",
    status: "Отклонено",
    dateOfRequest: "12.12.2020",
    category: "Отель",
  },
  {
    _id: "#876125",
    name: "Василий Волков",
    phone: "+7 777 777 77 77",
    email: "volkov374@gmail.com",
    status: "Оплачено",
    dateOfRequest: "12.12.2020",
    category: "Тур",
  },
  {
    _id: "#876126",
    name: "Анастасия Чиркова",
    phone: "+7 777 777 77 77",
    email: "chirkova.anastasia@gmail.com",
    status: "На Паузе",
    dateOfRequest: "12.12.2020",
    category: "Тур",
  },
];

const fakeColumns = [
  {
    id: "column0",
    header: () => <input type="checkbox" />,
    Cell: ({ row }) => (
      <input
        type="checkbox"
        onChange={(e) => e.target.checked && console.log(row.original._id)}
      />
    ),
  },
  {
    id: "column1",
    header: "ID заявки",
    accessor: "_id",
  },
  {
    id: "column2",
    header: "Имя клиента",
    accessor: "name",
  },
  {
    id: "column3",
    header: "Номер телефона",
    accessor: "phone",
  },
  {
    id: "column4",
    header: "Электронная почта",
    accessor: "email",
  },
  {
    id: "column5",
    header: "Дата заявки",
    accessor: "dateOfRequest",
  },
  {
    id: "column6",
    header: "Категория",
    accessor: "category",
  },
  {
    id: "column7",
    header: "Подробности",
    Cell: ({ row }) => <button>Открыть заказ</button>,
  },
  {
    id: "column8",
    header: "Статус",
    accessor: "status",
  },
  {
    id: "column9",
    header: () => <img src={trash} />,
    Cell: ({ row }) => <button>...</button>,
  },
];

const RequestTable = ({ data, columns }) => {
  const datas = useMemo(() => (data ? data : fakeData), []);

  const columnsData = columns ? columns : useMemo(() => fakeColumns, []);

  const {
    selectedFlatRows,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    // state: { selectedRowIds },
  } = useTable(
    {
      columns: columnsData,
      data: datas,
    },
    useSortBy
    // useRowSelect,
    // (hooks) => {
    //   hooks.visibleColumns.push((columns) => [
    //     {
    //       id: "selection",
    //       header: ({ getToggleAllRowsSelectedProps }) => (
    //         <div>
    //           <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
    //         </div>
    //       ),
    //       Cell: ({ row }) => (
    //         <div>
    //           <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
    //         </div>
    //       ),
    //     },
    //     ...columns,
    //   ]);
    // }
  );

  // console.log(`selected row ids: ${Object.keys(selectedRowIds)}`);

  return (
    <div className="container">
      <table {...getTableProps()} className={styles.table}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr className={styles.row} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  className={styles.head}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  {column.render("header")}
                  <span>
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <img src={sortButton} />
                      ) : (
                        <img src={sortButton} />
                      )
                    ) : (
                      <img src={sortButton} />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RequestTable;
