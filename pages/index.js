import React, { Component } from 'react'
import EnhancedTable from '../components/Table/EnhancedTable';
import Axios from 'axios';


const headCells = [
  { id: 'symbol', numeric: false, disablePadding: true, label: 'Pair' },
  { id: 'indexPrice', numeric: true, disablePadding: false, label: 'Price' },
  { id: 'liquidatePrice', numeric: true, disablePadding: false, label: 'Liquidation Price' },
  { id: 'liquidateRate', numeric: true, disablePadding: false, label: 'Liquidation Rate' },
  { id: 'marginLevel', numeric: true, disablePadding: false, label: 'Margin Level' },
];

export default class Home extends Component {
  state = {
    rows: []
  }
  componentDidMount() {
    Axios.get('/api/bnc/getMarginAccountAll').then(res => {
      this.setState({
        rows: [...res.data.assets.filter(asset => asset.liquidatePrice !== '0')]
      }, () => console.log(this.state))
    })
  }
  render() {
    return (
      <div>
        {this.state.rows.length > 0 && <EnhancedTable rows={this.state.rows} headCells={headCells}/>}
      </div>
    )
  }
}

