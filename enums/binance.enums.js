export const ORDER_TYPES = {
  limit: 'LIMIT',
  market: 'MARKET',
  stop_loss: 'STOP_LOSS',
  stop_loss_limit: 'STOP_LOSS_LIMIT',
  take_profit: 'TAKE_PROFIT',
  take_profit_limit: 'TAKE_PROFIT_LIMIT',
  limit_makes: 'LIMIT_MAKER',
};

export const TIME_IN_FORCE = {
  // An order will be on the book unless the order is canceled.
  good_till_cancel: 'GTC',
  // An order will try to fill the order as much as it can before the order expires.
  imediate_or_cancel: 'IOC',
  // An order will expire if the full order cannot be filled upon execution.
  fill_or_kill: 'FOK'
}

export const BALACES_TYPE = {
  spot: 'SPOT',
  margin: 'MARGIN'
}

export const binance_endpoints = {
  getMarginAccount: 'getMarginAccount',
  getMarginAccountAll: 'getMarginAccountAll',
}