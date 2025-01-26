const { PolarityClock } = require('./index.js');

class Block {
  constructor(data, timestamp, previousHash, hash) {
    this.data = data;
    this.timestamp = timestamp;
    this.previousHash = previousHash;
    this.hash = hash;
  }
}

class SimpleBlockchain {
  constructor() {
    // Initialize Polarity Clock
    this.clock = new PolarityClock();
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    const { timestamp } = this.clock.getCurrentTime();
    return new Block(
      "Genesis Block",
      timestamp,
      "0",
      "genesis-hash"
    );
  }

  addBlock(data) {
    const previousBlock = this.chain[this.chain.length - 1];
    const { timestamp } = this.clock.getCurrentTime();
    const timeHash = this.clock.getTimeHash();
    
    const newBlock = new Block(
      data,
      timestamp,
      previousBlock.hash,
      timeHash
    );

    this.chain.push(newBlock);
  }

  getChain() {
    return this.chain;
  }
}

// Usage example
const blockchain = new SimpleBlockchain();

// Add some blocks
blockchain.addBlock({ transaction: "First transaction" });
blockchain.addBlock({ transaction: "Second transaction" });

// Print the blockchain
console.log('\nBlockchain contents:');
console.log(JSON.stringify(blockchain.getChain(), null, 2));