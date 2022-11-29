import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

const columns = [
  { id: "id", label: "ID" },
  { id: "name", label: "Nombre" },
  {
    id: "entry",
    label: "Entrada",
    align: "right",
    format: (value) => value.toDateString(),
  },
  {
    id: "out",
    label: "Salida",
    align: "right",
    format: (value) => value.toDateString(),
  },
  {
    id: "checkin",
    label: "Checkin",
    align: "right",
    format: (value) => value.toDateString(),
  },
  {
    id: "checkout",
    label: "Checkout",
    align: "right",
    format: (value) => value.toDateString(),
  },

];

function createData(Id, name, entry,out, checkin, checkout) {
  return {
    Id, name, entry,out, checkin, checkout
  };
}

export function StickyTable(data) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  var rows = [];

  if (data.length == 0) {
    return <h1>No hay empleados por el momento</h1>;
  }

  data.data.map((employee) => {
    rows.push(
      createData(
        employee._id,
        employee.name,
        new Date(employee.entrada),
        new Date(employee.salida),
        new Date(employee.checkin),
        new Date(employee.checkout)
      )
    );
  });

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 550 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value != "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        style={{ overflow: "hidden" }}
      />
    </Paper>
  );
}
