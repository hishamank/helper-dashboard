import React from 'react'
import TradingViewWidget, { Themes } from 'react-tradingview-widget';

export default function index({symbol}) {
  return (
    <TradingViewWidget
    symbol={symbol}
    theme={Themes.DARK}
    locale="en"
    autosize
  />
  )
}