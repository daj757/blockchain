const Websocket = require("ws");
const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(",") : [];
const MESSAGE_TYPES = {
  chain: "CHAIN",
  transaction: "TRANSACTION",
  clear_transaction: "CLEAR_TRANSACTIONS"
};

class P2pServer {
  constructor(blockchain, transactionPool) {
    this.blockchain = blockchain;
    this.sockets = [];
    this.transactionPool = transactionPool;
  }

  listen() {
    const server = new Websocket.Server({
      port: P2P_PORT
    });
    server.on("connection", socket => this.connectSocket(socket));
    console.log(`listening to peer to peer connects on port ${P2P_PORT}`);
    this.connectToPeers();
  }

  connectToPeers() {
    peers.forEach(peer => {
      const socket = new Websocket(peer);
      socket.on("open", () => {
        this.connectSocket(socket);
      });
    });
  }

  connectSocket(socket) {
    this.sockets.push(socket);
    console.log("socket connected");
    this.messageHandler(socket);
    this.sendChain(socket);
  }

  messageHandler(socket) {
    socket.on("message", message => {
      const data = JSON.parse(message);
      switch (data.type) {
        case MESSAGE_TYPES.chain:
          this.blockchain.replaceChain(data.chain);
          break;
        case MESSAGE_TYPES.transaction:
          this.transactionPool.updateOrAddTransaction(data.transaction);
          break;
        case MESSAGE_TYPES.clear_transaction:
        this.transactionPool.clear();
        break;
      }
    });
  }

  sendChain(socket) {
    socket.send(
      JSON.stringify({
        type: MESSAGE_TYPES.chain,
        chain: this.blockchain.chain
      })
    );
  }

  sendTransaction(socket, transaction) {
    socket.send(
      JSON.stringify({
        type: MESSAGE_TYPES.transaction,
        transaction
      })
    );
  }

  syncChains() {
    this.sockets.forEach(socket => {
      this.sendChain(socket);
    });
  }

  broadcastTransaction(transaction) {
    this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
  }

  broadcastClearTransactions() {
    this.sockets.forEach(socket => socket.send(JSON.stringify({type: MESSAGE_TYPES.clear_transaction})))
  }
}
module.exports = P2pServer;
