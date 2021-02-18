import binanceService from '../../../services/binance'
import {BINANCE_API_ENDPOINT} from '../../../enums/binance.enums';

export default function bncHandler({ query: { id } }, res) {

  const binanceInstance = new binanceService();
  const in_symbols = ['DASHUSDT', 'EOSUSDT', 'LTCBTC', 'REEFBTC', 'ZECBTC' ]
  switch (id) {
    case BINANCE_API_ENDPOINT.getMarginAccount: {
      binanceInstance.getMarginIsolatedForSymbols(in_symbols).then(result => {
        res.status(200).json(result.data);
      }).catch(err => {
        console.log('errror', err);
      })
      break;
    }    
    case BINANCE_API_ENDPOINT.getMarginAccountAll: {
      binanceInstance.getMarginIsolatedInfos().then(result => {
        res.status(200).json(result.data);
      }).catch(err => {
        console.log('errror', err);
      })
      break;
    }
    default: {
      res.status(404).json({ message: `User with id: ${id} not found.` });
      break;
    }
  }
  // console.log('🚀 ~ file: index.js ~ line 37 ~ Home ~ componentDidMount ~ binanceService', binanceInstance);
}