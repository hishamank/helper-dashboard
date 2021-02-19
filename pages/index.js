import React, { Component } from 'react'
import OrdersTable from '../components/OrdersTable';
import EnhancedTable from '../components/Table/EnhancedTable';
import binanceService from '../services/binance'
import Axios from 'axios';
import dynamic from 'next/dynamic'

const ChartsComponentWithNoSSR = dynamic(() => import('../components/Chart'), { ssr: false });

export default class Home extends Component {
  state = {
    rows: [],
    pairOrders: [],
    error: null,
    selectedAsset: null,
    showingChart: false,
    showingOrders: false
  }
  componentDidMount() {
    if (!this.props.error && this.props.data && this.props.data.assets.length > 0) {
      this.setState({
        rows: [...this.props.data.assets.filter(asset => asset.liquidatePrice !== '0')]
      }, () => console.log('componentDidMount State update', this.state))
    } else {
      console.log('Errorr', this.props.error)
      this.setState({
        error: true
      })
    }
  }
  showChart = (asset) => {
    console.log('---- Asset', asset);
    if(this.state.showingChart) {
      this.setState({
        selectedAsset: this.state.showingOrders ? asset : null,
        showingChart: false
      })
    } else {
      this.setState({
        selectedAsset: asset,
        showingChart: true
      })
    }
  }
  getOrders = (asset) => {
    if (this.state.showingOrders) {
      this.setState((state) => ({
        pairOrders: [],
        selectedAsset: state.showingCharts ? asset : null,
        showingOrders: false
      }))
    } else {
      Axios.get('/api/getTrades/' + asset).then(res => {
        console.log('🚀 ~ file: index.js ~ line 36 ~ Home ~ Axios.get ~ res', res);
        this.setState((state, props) => ({
          pairOrders: [...res.data],
          selectedAsset: asset,
          showingOrders: true
        }), () => console.log('getOrders State update',this.state))
      })
    }
  }
  render() {
    if(this.state.error) {
      return <div>Something went wrong, or no Assets</div>
    }
    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <EnhancedTable rows={this.state.rows}  showChart={this.showChart} getOrders={this.getOrders} selectedAsset={this.state.showingChart} showingOrders={this.state.showingOrders} showingChart={this.state.showingChart}/>
        <div style={{display: 'flex', height: '500px'}}>
          <ChartsComponentWithNoSSR symbol={this.state.selectedAsset && this.state.showingChart || 'BTC.D'}/>
          {<OrdersTable orders={this.state.pairOrders}></OrdersTable>}
        </div>
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
  } catch (err) {
    return {
      props: {error: err}, // will be passed to the page component as props
    }
  }
}

