const axios = require('axios').default;
const env = require('../environment');
const crypto = require('crypto');
const {BALACES_TYPE} = require('../enums/binance.enums');
class BinanceService {
  url = env.urls[0];

  // needed to create the signature used in secure endpoint
  HMAC = (inputString) => {
    return crypto.createHmac('sha256', env.binanceSecret).update(inputString).digest('hex');
  };

  getQueryParamString = (params) =>
    Object.keys(params)
      .map(function (key) {
        return key + '=' + params[key];
      })
      .join('&');

  // trigger get requests on binance api
  getBinanceApi = (endpoint, params, isSigned) => {
    if (isSigned) {
      params['signature'] = this.HMAC(this.getQueryParamString(params));
    }
    return axios.get(this.url + endpoint, {
      params: {
        ...params
      },
      headers: {
        'X-MBX-APIKEY': env.binanceAPIKey
      },
    });
  };
  // post request binance api
  postBinanceApi = (endpoint, params, isSigned) => {
    if (isSigned) {
      params['signature'] = this.HMAC(this.getQueryParamString(params));
    }
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-MBX-APIKEY': env.binanceAPIKey
      },
      params: params,
      url: this.url + endpoint
    };
    return axios(options);
  };
  //put request binance api
  putBinanceApi = (endpoint, params, isSigned) => {
    if (isSigned) {
      params['signature'] = this.HMAC(this.getQueryParamString(params));
    }
    const options = {
      method: 'PUT',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-MBX-APIKEY': env.binanceAPIKey
      },
      params: params,
      url: this.url + endpoint
    };
    return axios(options);
  }
  // delete request binance api
  deleteBinanceApi = (endpoint, params, isSigned) => {
    if (isSigned) {
      params['signature'] = this.HMAC(this.getQueryParamString(params));
    }
    const options = {
      method: 'DELETE',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-MBX-APIKEY': env.binanceAPIKey
      },
      params: params,
      url: this.url + endpoint
    };
    return axios(options);
  }

  getServerTime = () => {
    return this.getBinanceApi('/api/v3/time', {});
  }
  // check if endpoints are working, change if not
  ping = (index = 0) =>
    new Promise((resolve, reject) => {
      console.log('--- Trying ', this.url);
      this.getBinanceApi('ping', {}).then((res) => {
        if (res.status !== 200) {
          if (index < 3) {
            this.url = env.urls[index];
            this.ping(index + 1);
          } else {
            reject();
          }
        } else {
          console.log('URL: ', this.url, ' Succeeded');
          resolve(true);
        }
      });
    });

  // perform order with type market
  makeMarketOrder = (c_symbol, side, quantity) => {
    const req = {
      symbol: c_symbol,
      side: side,
      type: 'MARKET',
      quantity: quantity,
      recvWindow: 60000,
      timestamp: new Date().getTime()
    };
    console.log('- Making Order: ', req);
    return this.postBinanceApi('/api/v3/order/test', req, true);
  };

  makeMarginOrder = (c_symbol, isolated, side, quantity) => {
    const req = {
      symbol: c_symbol,
      isIsolated: isolated,
      side: side,
      type: 'MARKET',
      quantity: quantity,
      recvWindow: 60000,
      timestamp: new Date().getTime()
    };
    console.log('- Making Margin Order: ', req);
    return this.postBinanceApi('/sapi/v1/margin/order', req, true);
  }

  repayMarginLoans = (c_symbol, isolated, quantity) => {
    const req = {
      symbol: c_symbol,
      isIsolated: isolated,
      quantity: quantity,
      recvWindow: 60000,
      timestamp: new Date().getTime()
    }
    console.log('- Repay loans: ', req);
    return this.postBinanceApi('/sapi/v1/margin/repay', req, true);
  }

  getAllCoinsInfo = () => this.getBinanceApi('/sapi/v1/capital/config/getall', { timestamp: new Date().getTime() }, true);

  getDailyAccountSnapchot = (serverTime) => this.getBinanceApi(
        '/sapi/v1/accountSnapshot',
        {
          timestamp: new Date().getTime(),
          type: BALACES_TYPE.margin, //	"SPOT", "MARGIN", "FUTURES"
        },
        true
      );

  getMarginIsolatedForSymbols = (symbols) => this.getBinanceApi('/sapi/v1/margin/isolated/account', {
    timestamp: new Date().getTime(),
    symbols: Array(symbols).join(',')
  }, true)
  
  getAllMarginIsolatedSymbols = () => this.getBinanceApi('/sapi/v1/margin/isolated/allPairs', {
    timestamp: new Date().getTime(),
  }, true)

  getAllMarginOrdersForSymbol = (c_symbol, isIsolated, from, to, limit) => this.getBinanceApi('/sapi/v1/margin/allOrders', {
    symbol: c_symbol,
    isIsolated: isIsolated,
    limit: limit,
    startTime: from,
    endTime: to,
    timestamp: new Date().getTime()
  }, true)  
  
  getAllMarginTradesForSymbol = (c_symbol, isIsolated, from, to, limit) => this.getBinanceApi('/sapi/v1/margin/myTrades', {
    symbol: c_symbol,
    isIsolated: isIsolated,
    limit: limit,
    startTime: from,
    endTime: to,
    timestamp: new Date().getTime()
  }, true)  
  
  getAllMarginMaxTransfarableForSymbol = (asset, isIsolated) => this.getBinanceApi('/sapi/v1/margin/maxTransferable', {
    asset: asset,
    isolatedSymbol: isIsolated,
    timestamp: new Date().getTime()
  }, true);

  getMarginIsolatedInfos = (symbols = undefined) => this.getBinanceApi('/sapi/v1/margin/isolated/account', {
    timestamp: new Date().getTime()
  }, true)

  createNewListenKey = (isMargin, isIsolated) => this.postBinanceApi(`${isMargin ? '/sapi/v1/' : '/api/v3/'}userDataStream${isIsolated ? '/isolated' : ''}`, {});
  renewListenKey = (isMargin, isIsolated) => this.putBinanceApi(`${isMargin ? '/sapi/v1/' : '/api/v3/'}userDataStream${isIsolated ? '/isolated' : ''}`, {});
  deleteListenKey = (isMargin, isIsolated) =>  this.deleteBinanceApi(`${isMargin ? '/sapi/v1/' : '/api/v3/'}userDataStream${isIsolated ? '/isolated' : ''}`, {})
  
}

module.exports = BinanceService;
