import { PolarityClock } from '../PolarityClock';
import { Block } from './Block';
import { Transaction } from './Transaction';
import { SmartContract } from './SmartContract';
import { Token } from './Token';
import BigNumber from 'bignumber.js';

export class Blockchain {
  private chain: Block[];
  private difficulty: number;
  private pendingTransactions: Transaction[];
  private miningReward: number;
  private clock: PolarityClock;
  private contracts: Map<string, SmartContract>;
  private balances: Map<string, BigNumber>;
  private lastBlockTime: number;
  private blockInterval: number = 2300;
  private transactionCount: number = 0;
  private tokens: Map<string, Token> = new Map();
  private nativeToken: Token | null = null;
  private currentBlockHeight: number = 1000000;

  constructor() {
    this.clock = new PolarityClock();
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
    this.pendingTransactions = [];
    this.miningReward = 100;
    this.contracts = new Map();
    this.balances = new Map();
    this.lastBlockTime = Date.now();
    this.startBlockCreation();
    this.initializeNativeToken();
  }

  private createGenesisBlock(): Block {
    const { timestamp } = this.clock.getCurrentTime();
    const timeHash = this.clock.getTimeHash();
    return new Block(timestamp, [], "0", [], timeHash, this.currentBlockHeight++);
  }

  public getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  private startBlockCreation(): void {
    setInterval(() => {
      const { timestamp } = this.clock.getCurrentTime();
      const timeHash = this.clock.getTimeHash();

      if (this.pendingTransactions.length > 0) {
        this.minePendingTransactions("miner-address");
        this.transactionCount++;

        if (this.transactionCount > 10) {
          this.blockInterval = Math.max(1000, this.blockInterval - 100);
          this.transactionCount = 0;
        }
      } else {
        const emptyBlock = new Block(
          timestamp,
          [],
          this.getLatestBlock().hash,
          [],
          timeHash,
          this.currentBlockHeight++
        );
        emptyBlock.mineBlock(this.difficulty);
        this.chain.push(emptyBlock);
      }
    }, this.blockInterval);
  }

  public minePendingTransactions(miningRewardAddress: string): void {
    const { timestamp } = this.clock.getCurrentTime();
    const timeHash = this.clock.getTimeHash();

    const block = new Block(
      timestamp,
      this.pendingTransactions,
      this.getLatestBlock().hash,
      [],
      timeHash,
      this.currentBlockHeight++
    );

    block.mineBlock(this.difficulty);
    this.chain.push(block);

    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward)
    ];
  }

  public getPendingTransactions(): Transaction[] {
    return this.pendingTransactions;
  }

  public createToken(name: string, symbol: string, decimals: number, owner: string, totalSupply: string): string {
    const tokenId = `${name}_${Date.now()}`;
    const newToken = new Token(name, symbol, decimals, owner, totalSupply);
    this.tokens.set(tokenId, newToken);
    return tokenId;
  }

  public addTransaction(transaction: Transaction): void {
    if (!transaction.isValid()) {
      throw new Error('Invalid transaction');
    }
    this.pendingTransactions.push(transaction);
  }

  public deployContract(contract: SmartContract): void {
    if (this.contracts.has(contract.address)) {
      throw new Error('Contract address already exists');
    }
    this.contracts.set(contract.address, contract);
    console.log(`Smart contract deployed at address: ${contract.address}`);
  }

  public getBalance(address: string): BigNumber {
    return this.balances.get(address) || new BigNumber(0);
  }

  public listTokens(): any[] {
    return Array.from(this.tokens.values()).map(token => ({
      name: token.name,
      symbol: token.symbol,
      totalSupply: token.totalSupply.toString(),
      decimals: token.decimals
    }));
  }

  public getTransaction(transactionHash: string): Transaction | null {
    for (const block of this.chain) {
      for (const tx of block.transactions) {
        if (tx.hash === transactionHash) {
          return tx;
        }
      }
    }
    return null;
  }

  public getAddressStats(address: string): { balance: string; transactions: number } {
    const balance = this.getBalance(address).toString();
    let transactions = 0;

    for (const block of this.chain) {
      for (const tx of block.transactions) {
        if (tx.fromAddress === address || tx.toAddress === address) {
          transactions++;
        }
      }
    }

    return { balance, transactions };
  }

  public getNativeToken(): Token | null {
    return this.nativeToken;
  }

  public getDifficulty(): number {
    return this.difficulty;
  }

  public getBlockInterval(): number {
    return this.blockInterval;
  }

  private initializeNativeToken() {
    const polarityToken = new Token(
      'POLARITY',
      'POLARITY',
      18,
      '04344949cc425157846486bd6f6c7cc0330bcf602598b8c7cd6bc911a6a9ddd2c0bc27927dd556ac914a8060a60fa784772c3577d6a2504b0ba0731a22a59efde3',
      '9988498200'
    );
    this.nativeToken = polarityToken;
    this.tokens.set('POLARITY', polarityToken);
    console.log('Native token POLARITY initialized');
  }

  public getChain(): Block[] {
    return this.chain;
  }
}
