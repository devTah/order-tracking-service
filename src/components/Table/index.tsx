import React, { FC } from "react";
import {
  Table as MaUTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { useTable, useSortBy, Column, usePagination, useFilters } from "react-table";
import _ from "lodash";
import { DefaultColumnFilter, fuzzyTextFilterFn } from "./common/FilterComponent";
declare type TableProps = {
  columns: Column<object>[];
  data: object[];
  handlePageChange?: (page: number) => void;
  handleChangeRowsPerPage?: (page: number) => void;
};

const Table: FC<TableProps> = (props) => {
  const { columns, data } = props;

  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const filterTypes = React.useMemo(
    () => ({
      fuzzyText: fuzzyTextFilterFn,
      text: (rows: any, id: any, filterValue: any) => {
        if (_.some(rows))
          return rows?.filter((row: any) => {
            const rowValue = row?.values[id];
            return rowValue !== undefined ? String(rowValue).toLowerCase().startsWith(String(filterValue).toLowerCase()) : true;
          });
        return null;
      },
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
      initialState: { pageSize: 20 },
    },
    useFilters,
    useSortBy,
    usePagination
  );

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
    gotoPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPageSize(Number(event.target.value));
  };
  return (
    <>
      <TableContainer>
        <MaUTable {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column: any) => (
                  <TableCell {...column.getHeaderProps(column.getSortByToggleProps())}>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <TableSortLabel
                        active={_.get(column, "isSorted")}
                        direction={_.get(column, "isSortedDesc") ? "desc" : "asc"}
                      >
                        {column.render("Header")}
                      </TableSortLabel>
                    </div>
                    <div>{column.canFilter ? column.render("Filter") : null}</div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return <TableCell {...cell.getCellProps()}>{cell.render("Cell")}</TableCell>;
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </MaUTable>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={data.length}
        rowsPerPage={pageSize}
        page={pageIndex}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <div>Showing the first 20 results of {page.length} rows</div>
    </>
  );
};

export default Table;
