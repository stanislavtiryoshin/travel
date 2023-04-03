import React, { useMemo } from "react";

import { useRowSelect, useSortBy, useTable } from "react-table";
import styles from "./Requests.module.scss";
import sortButton from "./button.svg";

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
    cell: (row) => <button>Открыть заказ</button>,
  },
  {
    id: "column8",
    header: "Статус",
    accessor: "status",
  },
  {
    id: "column9",
    header: "...",
    cell: (row) => <img src={`./trash.svg`} />,
  },
];

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    );
  }
);

const RequestTable = ({ data, columns }) => {
  const datas = useMemo(() => (data ? data : fakeData), []);

  const columnsData = useMemo(() => (columns ? columns : fakeColumns), []);

  const {
    selectedFlatRows,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { selectedRowIds },
  } = useTable(
    {
      columns: columnsData,
      data: datas,
    },
    useSortBy,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: "selection",
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );

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
