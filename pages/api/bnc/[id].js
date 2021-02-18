
export default function bncHandler({ query: { id } }, res) {
  const binanceInstance = new binanceService();
  const in_symbols = ['DASHUSDT', 'EOSUSDT', 'LTCBTC', 'REEFBTC', 'ZECBTC' ]
  console.log('🚀 ~ file: index.js ~ line 37 ~ Home ~ componentDidMount ~ binanceService', this.binanceInstance);
  binanceInstance.getAllMarginIsolatedSymbols(in_symbols).then(res => {
    res.status(200).json(res.data)
  }).catch(err => {
    res.status(404).json({ message: `User with id: ${id} not found.` })
  })
}