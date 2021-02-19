import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});


function OrdersTable({orders}) {
  console.log('🚀 ~ file: OrdersTable.jsx ~ line 19 ~ OrdersTable ~ orders', orders);
  const classes = useStyles();
  const getReadableTime = (timestamp) => {
    let isodate = new Date(timestamp).toISOString();
    isodate = isodate.split('T');
    const cleanedSeconds = isodate[1].split('.')[0];
    return isodate[0] + ' ' + cleanedSeconds;
  }
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell>Side</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Quantity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders && orders.length > 0 ? orders.map((row) => {
            const classname = row.isBuyer ? 'green-color' : 'red-color'
            return (
            <TableRow key={row.id}>
              <TableCell className={classname}> {getReadableTime(row.time)}</TableCell>
              <TableCell className={classname}> {row.isBuyer ? 'BUY' : 'SELL'}</TableCell>
              <TableCell className={classname}> {row.price}</TableCell>
              <TableCell className={classname}> {row.qty}</TableCell>
            </TableRow>
          )}): (<div style={{width: '100%', marginTop: '1em', fontSize: '1.2em', color: 'lightgrey'}}> You have to select an asset </div>)}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default OrdersTable;