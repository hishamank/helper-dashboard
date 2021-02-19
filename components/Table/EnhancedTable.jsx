import React, { useState, useEffect } from 'react';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import EnhancedTableHead from './EnhancedTableHead';
import EnhancedTableToolbar from './EnhancedTableToolbar';
import { Button } from '@material-ui/core';
import BarChartIcon from '@material-ui/icons/BarChart';


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

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}


const headCells = [
  { id: 'symbol', numeric: false, disablePadding: true, label: 'Pair' },
  { id: 'indexPrice', numeric: true, disablePadding: false, label: 'Price' },
  { id: 'liquidatePrice', numeric: true, disablePadding: false, label: 'Liquidation Price' },
  { id: 'liquidateRate', numeric: true, disablePadding: false, label: 'Liquidation Rate' },
  { id: 'marginLevel', numeric: true, disablePadding: false, label: 'Margin Level' },
  { id: 'Entry', numeric: true, disablePadding: false, label: 'Entry Price' },
  { id: 'binanceButton', numeric: false, disablePadding: false, label: '' },

];



const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

function EnhancedTable({rows, itemClick, selectedAsset}) {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(rows.length || 5);

  useEffect(()=>{
    const res = JSON.parse(localStorage.getItem('assetsEntries'));
    setAssetsEntries(res);
  },[rows])
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.symbol);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
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

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const [assetsEntries, setAssetsEntries] = useState({});

  function HandleInputChange(event, asset) {
    console.log('\inside function', event.target.value)
    if (event.target.value && event.target.value.length > 0) {
      let newAssetsEntries = {
        ...assetsEntries
      };
      newAssetsEntries[asset.symbol] = event.target.value;
      setAssetsEntries(newAssetsEntries);
      console.log('statae', assetsEntries);
    }
  }


function handleOnBlur(){
  localStorage.setItem('assetsEntries', JSON.stringify(assetsEntries))
}

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              headCells={headCells}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.symbol);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.symbol}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                          onChange={(event) => handleClick(event, row.symbol)}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row.symbol}
                      </TableCell>
                      <TableCell align="right">{row.indexPrice}</TableCell>
                      <TableCell align="right">{row.liquidatePrice}</TableCell>
                      <TableCell align="right">{row.liquidateRate}</TableCell>
                      <TableCell align="right" style={row.marginLevel > 1.5 ? { color: 'green' } : row.marginLevel < 1.3 ? { color: 'red' } : { color: 'yellow' }} >{row.marginLevel}</TableCell>
                      <TableCell align="right"> 
                        <input onBlur={handleOnBlur} onChange={e => HandleInputChange(e, row)} onClick={(e) => e.stopPropagation()} style={{
                        background: 'gray',
                        width: '100px',
                        height: '100%',
                        color: 'white',
                        border: '1px solid white'
                      }} type="number"
                      value={assetsEntries && (assetsEntries[row.symbol] || 0)}
                      ></input></TableCell>
                      <TableCell align="right" style={{display: 'flex', alignItems: 'center'}}>
                        <Button a href={`https://www.binance.com/en/trade/${row.baseAsset && row.baseAsset.asset}_${row.quoteAsset && row.quoteAsset.asset}`} target="_blank" >Binance</Button>
                        <Button style={{ margin: '0 10px' }} a href={`https://www.tradingview.com/chart/?symbol=BINANCE:${row.symbol}`} variant="contained" color="primary" target="_blank">TradingV</Button>
                        <BarChartIcon className={selectedAsset === row.symbol ? "charts-icon selected" : "charts-icon"} onClick={() => selectedAsset === row.symbol || itemClick(row.symbol)}></BarChartIcon>
                      </TableCell>
                    </TableRow>

                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      {/* <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      /> */}
    </div>
  );
}


export default EnhancedTable;