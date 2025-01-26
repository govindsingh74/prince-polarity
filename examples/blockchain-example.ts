import { PolarityClock } from '../src';

class Block {
  constructor(
    public data: any,
    public timestamp: number,
    public previousHash: string,
    public hash: string
  ) {}
}

class SimpleBlockchain {
  private clock: PolarityClock;
  private chain: Block[];

  constructor() {
    // Initialize Polarity Clock
    this.clock = new PolarityClock();
    this.chain = [this.createGenesisBlock()];
  }

  private createGenesisBlock(): Block {
    const { timestamp } = this.clock.getCurrentTime();
    return new Block(
      "Genesis Block",
      timestamp,
      "0",
      "genesis-hash"
    );
  }

  public addBlock(data: any): void {
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

  public getChain(): Block[] {
    return this.chain;
  }
}

// Usage example
const blockchain = new SimpleBlockchain();
blockchain.addBlock({ transaction: "First transaction" });
blockchain.addBlock({ transaction: "Second transaction" });

console.log(blockchain.getChain());