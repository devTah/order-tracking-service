import React from "react";
import * as matchSorter from "match-sorter";
import { MenuItem, Select, TextField } from "@mui/material";
import { UpdatedTime } from "./enum";

function SliderColumnFilter({ column: { filterValue, setFilter, preFilteredRows, id } }) {
  // Calculate the min and max
  // using the preFilteredRows

  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    preFilteredRows.forEach((row) => {
      min = Math.min(row.values[id], min);
      max = Math.max(row.values[id], max);
    });
    return [min, max];
  }, [id, preFilteredRows]);

  return (
    <>
      <TextField
        margin="dense"
        size="small"
        hiddenLabel
        variant="standard"
        type="range"
        minRows={min}
        maxRows={max}
        value={filterValue || min}
        onChange={(e) => {
          setFilter(parseInt(e.target.value, 10));
        }}
      />
      <button onClick={() => setFilter(undefined)}>Off</button>
    </>
  );
}

// This is a custom UI for our 'between' or number range
// filter. It uses two number boxes and filters rows to
// ones that have values between the two
function NumberRangeColumnFilter({ column: { filterValue = [], preFilteredRows, setFilter, id } }) {
  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    preFilteredRows.forEach((row) => {
      min = Math.min(row.values[id], min);
      max = Math.max(row.values[id], max);
    });
    return [min, max];
  }, [id, preFilteredRows]);

  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <TextField
        value={filterValue[0] || ""}
        type="number"
        onChange={(e) => {
          const val = e.target.value;
          setFilter((old = []) => [val ? parseInt(val, 10) : undefined, old[1]]);
        }}
        placeholder={`Min (${min})`}
        style={{
          width: "70px",
          marginRight: "0.5rem",
        }}
        margin="dense"
        size="small"
        hiddenLabel
        variant="standard"
      />
      to
      <TextField
        margin="dense"
        size="small"
        hiddenLabel
        variant="standard"
        value={filterValue[1] || ""}
        type="number"
        onChange={(e) => {
          const val = e.target.value;
          setFilter((old = []) => [old[0], val ? parseInt(val, 10) : undefined]);
        }}
        placeholder={`Max (${max})`}
        style={{
          width: "70px",
          marginLeft: "0.5rem",
        }}
      />
    </div>
  );
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

// a unique option from a list
function SelectColumnFilter({ column: { filterValue = 0, setFilter, preFilteredRows, id } }) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const option = new Set();
    preFilteredRows.forEach((row) => {
      option.add(row.values[id]);
    });
    return [...option.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <Select
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <MenuItem value={0}>All</MenuItem>
      {options.map((option, i) => (
        <MenuItem key={i} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  );
}

function UpdatedTimeColumnFilter({ column: { filterValue = 0, setFilter, preFilteredRows, id } }) {
  // Calculate the options for filtering
  // using the preFilteredRows
  // Render a multi-select box
  const [selected, setSelected] = React.useState(0);
  const time = {
    [UpdatedTime.last5]: 60 * 5 * 1000,
    [UpdatedTime.last10]: 60 * 10 * 1000,
    [UpdatedTime.last15]: 60 * 15 * 1000,
  };

  console.log(filterValue);
  return (
    <Select
      value={selected}
      onChange={(e) => {
        const val = e.target.value;
        setSelected(val);
        setFilter(() => (val ? [(new Date().getTime() - val), new Date().getTime()] : 0));
      }}
    >
      <MenuItem value={0}>All</MenuItem>
      {Object.values(UpdatedTime).map((option, i) => (
        <MenuItem key={i} value={time[option]}>
          {option}
        </MenuItem>
      ))}
    </Select>
  );
}

function DefaultColumnFilter({ column: { filterValue, preFilteredRows, setFilter } }) {
  const count = preFilteredRows.length;

  return (
    <TextField
      margin="dense"
      size="small"
      hiddenLabel
      variant="standard"
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  );
}

export {
  fuzzyTextFilterFn,
  NumberRangeColumnFilter,
  SliderColumnFilter,
  SelectColumnFilter,
  DefaultColumnFilter,
  UpdatedTimeColumnFilter,
};
