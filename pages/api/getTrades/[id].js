import binanceService from '../../../services/binance';

export default function getTradesHandler({ query: { id } }, res) {
  const binanceInstance = new binanceService();
  binanceInstance.getAllMarginTradesForSymbol(id, true).then(result => {
    res.status(200).json(result.data);
  }).catch(err => {
    console.log('errror', err);
    res.status(400).json({
      ...err
    })
  })
}