const binanceService = require('./binance');

const binanceInstance = new binanceService();

const in_symbols = ['DASHUSDT', 'EOSUSDT', 'LTCBTC', 'REEFBTC', 'ZECBTC' ]

binanceInstance.getAllMarginIsolatedSymbols(in_symbols).then(res => {
  console.log(res.data);
})


// binanceInstance.createNewListenKey().then(res => {
//   console.log(res.data);
// })
