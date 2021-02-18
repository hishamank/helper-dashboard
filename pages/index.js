import React, { Component } from 'react'
import OrdersTable from '../components/OrdersTable';
import EnhancedTable from '../components/Table/EnhancedTable';
import binanceService from '../services/binance'


const headCells = [
  { id: 'symbol', numeric: false, disablePadding: true, label: 'Pair' },
  { id: 'indexPrice', numeric: true, disablePadding: false, label: 'Price' },
  { id: 'liquidatePrice', numeric: true, disablePadding: false, label: 'Liquidation Price' },
  { id: 'liquidateRate', numeric: true, disablePadding: false, label: 'Liquidation Rate' },
  { id: 'marginLevel', numeric: true, disablePadding: false, label: 'Margin Level' },
];

export default class Home extends Component {
  state = {
    rows: [],
    error: null
  }
  componentDidMount() {
    if (!this.props.error && this.props.data && this.props.data.assets.length > 0) {
      this.setState({
        rows: [...this.props.data.assets.filter(asset => asset.liquidatePrice !== '0')]
      }, () => console.log(this.state))
    } else {
      console.log('Errorr', this.props.error)
      this.setState({
        error: true
      })
    }
  }
  render() {
    if(this.state.error) {
      return <div>Something went wrong, or no Assets</div>
    }
    return (
      <div>
         <EnhancedTable rows={this.state.rows} headCells={headCells}/>
          <OrdersTable></OrdersTable>
      </div>
      
    )
  }
}

export async function getServerSideProps(context) {
  const binanceInstance = new binanceService();
  try {
    const res = await binanceInstance.getMarginIsolatedInfos();
    return {
      props: {data: res.data}, // will be passed to the page component as props
    }
  } catch (er) {
    return {
      props: {error: err}, // will be passed to the page component as props
    }
  }
}

