import React, { Component } from 'react'
import OrdersTable from '../components/OrdersTable';
import EnhancedTable from '../components/Table/EnhancedTable';
import binanceService from '../services/binance'
import Axios from 'axios';



export default class Home extends Component {
  state = {
    rows: [],
    pairOrders: [],
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
  handleItemClick = (asset) => {
    console.log('---- Asset', asset);
    Axios.get('/api/getTrades/' + asset).then(res => {
      console.log('🚀 ~ file: index.js ~ line 36 ~ Home ~ Axios.get ~ res', res);
      this.setState({
        pairOrders: [...res.data]
      }, () => console.log(this.state))
    })
  }
  render() {
    if(this.state.error) {
      return <div>Something went wrong, or no Assets</div>
    }
    return (
      <div>
        <EnhancedTable rows={this.state.rows}  itemClick={this.handleItemClick}/>
        <OrdersTable rows={this.state.pairOrders}></OrdersTable>
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

