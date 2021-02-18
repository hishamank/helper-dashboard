const binanceService = require('./services/binance');

const binanceInstance = new binanceService();

// const tradeAllMyCurrenciesToBTC = () => {
  // binanceInstance.ping().then(succeeded => {
  //   if (succeeded) {
  // TODO: Get all curriences in my account and store them in an array
  // TODO: forEach on the array, and perform market order with the symbol + BTC as string
  //   }
  // })
// };

// binanceInstance.makeMarketOrder('DOTBTC', 'BUY', 1).then(res => {
//   console.log('---res', res);
// }).catch(err => {
//   console.log('--- Error', err);
// });

const printBalancesOverDuration = () => {
  binanceInstance
  .getDailyAccountSnapchot()
  .then((res) => {
    res.data.snapshotVos.forEach(snap => {
      const balances_in_date = snap.data.balances.filter((asset) => asset.free > 0);
      const total_assets_in_BTC = snap.data.totalAssetOfBtc;
      console.log('--- In ', new Date(snap.updateTime).toLocaleString(), 'TOTAL: ', total_assets_in_BTC, ' BALANCES: ', balances_in_date);
    });
  })
  .catch((err) => {
    console.log('🚀 ~ file: spotTrading.js ~ line 24 ~ binanceInstance.getAllBalances ~ err', err);
  });
}

// binanceInstance.makeMarginOrder('DOTBTC',true, 'BUY', 1).then(res => {
//   console.log('---res', res);
// }).catch(err => {
//   console.log('--- Error', err);
// });

// binanceInstance.repayMarginLoans('DOTBTC',true, 0.01).then(res => {
//   console.log('---res', res);
// }).catch(err => {
//   console.log('--- Error', err);
// });

console.log(await binanceInstance.getDailyAccountSnapchot());