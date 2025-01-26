import { SHA256 } from 'crypto-js';
import { Transaction } from './Transaction';
import { SmartContract } from './SmartContract';

export class Block {
  public nonce: number;
  public hash: string;
  public blockHeight: number;

  constructor(
    public timestamp: number,
    public transactions: Transaction[],
    public previousHash: string,
    public contracts: SmartContract[] = [],
    public timeHash: string,
    blockHeight: number
  ) {
    this.nonce = 0;
    this.blockHeight = blockHeight;
    this.hash = this.calculateHash();
  }

  calculateHash(): string {
    return SHA256(
      this.previousHash +
      this.timestamp +
      JSON.stringify(this.transactions) +
      this.nonce +
      this.timeHash +
      this.blockHeight
    ).toString();
  }

  mineBlock(difficulty: number): void {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
  }

  hasValidTransactions(): boolean {
    for (const tx of this.transactions) {
      if (!tx.isValid()) {
        return false;
      }
    }
    return true;
  }

  executeContracts(): void {
    for (const contract of this.contracts) {
      contract.execute();
    }
  }
}