import moment from "moment";
import React from "react";
import { SelectColumnFilter, UpdatedTimeColumnFilter } from "src/components/Table/common/FilterComponent";
import Table from "../../components/Table";
import makeData from "../../helper/makeData";

export default function Dashboard() {
  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Status",
        accessor: "status",
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Customer name",
        accessor: "customerName",
      },
      {
        Header: "Rider name",
        accessor: "riderName",
      },
      {
        Header: "Merchant name",
        accessor: "merchantName",
      },
      {
        Header: "Merchant address",
        accessor: "merchantAddress",
      },
      {
        Header: "Total price",
        accessor: "totalPrice",
      },
      {
        Header: "Updated time",
        accessor: "updatedTime",
        Cell: ({ value }: any) => {
          return moment(value).local().format("DD-MM-YYYY hh:mm:ss a");
        },
        sortType: (rowA: any, rowB: any) => {
          if (rowA.updatedTime < rowB.updatedTime) return 1;
          if (rowA.updatedTime > rowB.updatedTime) return -1;
          return 0;
        },
        Filter: UpdatedTimeColumnFilter,
        filter: "between",
      },
      {
        Header: "Name",
        accessor: "dishes.name",
      },
      {
        Header: "Price",
        accessor: "dishes.price",
      },
    ],
    []
  );
  const data = React.useMemo(() => makeData(100), []);

  console.log({ data });

  return (
    <div>
      <Table columns={columns} data={data} />
    </div>
  );
}
