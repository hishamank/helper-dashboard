const io = require('socket.io-client');
const binanceService = require('./services/binance');
const binanceInstance = new binanceService();
const env = require('./environment');

// You cannot force a socket message to come to you, it will automatically do so when any information changes, 
// ie an order gets added, cancelled, filled, when any of your balances change, etc.

// Thus, if you want information before listening to the websocket, you'll need to take a snapshot first 
// via the REST api and then modify it with socket updates (I'm mostly thinking about balances for this one).

// A few events to listen for:

// -"open", to be sure your websocket did open.

// -"message", to receive information.

// -"close", to restart any websocket that hangs for any reason.

// -"error", mostly because otherwise ws will throw "unhandled error" otherwise.

// -"ping", to which you should reply socket.pong(), documented here.

// You might also need a way to restart a websocket in case it silently closed.You could try to send pings 
// at regular intervals and restart if a pong doesn't come back in X seconds, 
// or simply restart after X seconds/minutes without any new message from a socket.



const connectToSocket = async () => {
  const key = await binanceInstance.createNewListenKey();
  const socket = io(env.socketEndPoint + '/ws/' + key.listenKey);
  socket.on("open", () => {
    console.log('--- Socket open');
  })
  socket.on("message", () => {
    console.log('--- Socket message', );
  })
  socket.on("close", () => {
    console.log(' --- Socket close');
  })
  socket.on("error", () => {
    console.log(' --- Socket error');
  })  
  socket.on("ping", () => {
    console.log(' --- Socket ping');
  })
}

connectToSocket()
