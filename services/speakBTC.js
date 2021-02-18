const say = require('say')
const axios = require('axios');

const COIN = 'BTC';
const TIME_IN_MINUTES = 5;

let lastBTCPRICE = 0;
let counter = 0;
const speakCoinPrice = () => {
  axios(`https://api.coindesk.com/v1/bpi/currentprice/${COIN}.json`).then(res => {
    if(res.data && res.data.bpi['USD']) {
      const btc_usd_price = Math.round(Number(res.data.bpi['USD'].rate.replace(',', '')));
      say.speak(`${COIN} ${btc_usd_price} $ ${lastBTCPRICE > btc_usd_price ? 'tabashit tabashit' : 'alaait alaait'}`, 'Samantha');
      lastBTCPRICE = btc_usd_price;
    } else {
      say.speak(`Coin not available`, 'Samantha');
    }
  }).catch(err => {
    say.speak(`Coin not available`, 'Samantha');
  });
}

speakCoinPrice();
setInterval(speakCoinPrice, 60000 * TIME_IN_MINUTES);

