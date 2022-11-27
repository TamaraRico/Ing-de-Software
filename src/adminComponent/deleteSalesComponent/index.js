import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import TextField from '@mui/material/TextField';
import {Button} from '@mui/material';
import swal from 'sweetalert';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}
//function createData(_id, employee, factured_date, purchased_products, total) {
const headCells = [
  {
    id: '_id',
    numeric: false,
    disablePadding: true,
    label: 'ID',
  },
  {
    id: 'employee',
    numeric: false,
    disablePadding: false,
    label: 'Employee',
  },
  {
    id: 'factured_date',
    numeric: false,
    disablePadding: false,
    label: 'Factured date',
  },
  {
    id: 'purchased_products',
    numeric: true,
    disablePadding: false,
    label: 'Purchased products',
  },
  {
    id: 'total',
    numeric: true,
    disablePadding: false,
    label: 'Total',
  },
];

function EnhancedTableHead(props) {
  const {numSelected,  order, orderBy,  onSelectAllClick,onRequestSort ,rowCount } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onClick={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}


EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;
  
  const handleDelete = () => { //ELIMINACION POR CHECKBOX
    window.api.send('sales_by_date:delete', props.selectedElements);
    setTimeout(()=>{ //Delay para asegurar que se elimina
      window.api.send('sales:fetch');
      window.api.receive('sales:fetch',   async (data) => {
        await data
        console.log(data) //Checar purchased products
        props.updateRows(data)  //Actualiza arreglo de la tabla
        props.setSelected([])   //Reinicia elementos seleccionados
      }) 
    },300);
  }
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Ventas
        </Typography>
      )}

      {<Tooltip title="Delete">
          <IconButton onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
     }
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  selectedElements: PropTypes.array.isRequired,
  updateRows: PropTypes.func.isRequired,
  setSelected: PropTypes.func.isRequired,
};

export default function DeleteSales() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('_id');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  //Para esperar datos en lo que carga la table
  const [isloading,setLoading] = React.useState(true); 
  //Mis datos que se reciben con window api
  const [rows = [],updateRows] = React.useState(fetchSales());

  const [startDate,setStartDate] = React.useState(new Date().toISOString().slice(0, 10)); 
  const [endDate,setEndDate] = React.useState(new Date().toISOString().slice(0, 10)); 
  const [checked, setCheck] = React.useState(true);


  const handleSelectAllClick = (event) => {
    setCheck(!checked)
    if (checked) {
      console.log("event.target.checked")
      const newSelected = rows.map((n) => n._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  function fetchSales(){
    if(isloading){
      window.api.send('sales:fetch');
      window.api.receive('sales:fetch',   async (data) => {
        await data
        setLoading(false)
        updateRows(data)
      })
    }
  }
 
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };



  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
    console.log(newSelected)
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;


  const fetchEntreFechas = () => {
    let start = new Date(startDate)
    let end = new Date(endDate)
    if(start > end){ //La buen burbuja nada le gana
      let aux = end
      end = start
      start = aux
    }
    end.setDate(end.getDate() + 1) 
    window.api.send('sales_by_date:fetch', new Date(start.toISOString()), new Date(end.toISOString()));
    window.api.receive('sales_by_date:fetch',  async (data) => {
      if(data.length === 0){ //No hay ventas en las fechas solicitadas
        updateRows([])
        swal({
          title: "Sin resultados",
          text: "No hay fechas entre " + start + ' a ' + end,
          icon: 'warning',
          confirmButtonText: 'Aceptar',
        })
      }
      else{
        updateRows(data)
      }
      
    });
  };
  


  if(isloading){
    return <div>Loading...</div>;
  }
  else{
    return (
      
      <Box sx={{ width: '100%' }}>
        <TextField
          id="date_start"
          label="Desde"
          type="date"
          defaultValue={new Date().toISOString().slice(0, 10)}
          onChange={(e) => setStartDate(e.target.value) }
          sx={{ width: 220 }}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          id="date_end"
          label="Hasta"
          type="date"
          defaultValue={new Date().toISOString().slice(0, 10)}
          onChange={(e) => setEndDate(e.target.value) }
          sx={{ width: 220 }}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button variant="contained" onClick={fetchEntreFechas}>Buscar</Button>
        <Paper sx={{ width: '100%', mb: 2 }}>

          <EnhancedTableToolbar 
            numSelected={selected.length} 
            selectedElements = {selected}
            updateRows = {updateRows}
            setSelected = {setSelected}
          />
          <TableContainer >
            <Table
              sx={{ minWidth: 900 }}
              aria-labelledby="tableTitle"
              size={dense ? 'small' : 'medium'}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody >
                {
                  
                stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row._id);
                    const labelId = `enhanced-table-checkbox-${index}`;
  
                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row._id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row._id}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              'aria-labelledby': labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {row._id}
                        </TableCell>
                        <TableCell align="left">{row.employee}</TableCell>
                        <TableCell align="left">{row.factured_date}</TableCell>
                        <TableCell align="right">{row.purchased_products}</TableCell>
                        <TableCell align="right">{row.total}</TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 53 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label="Dense"
        />
      </Box>
    );
  }
}
