import { Blockchain } from '../blockchain/Blockchain';
import { Block } from '../blockchain/Block';
import { Transaction } from '../blockchain/Transaction';

export class BlockchainScanner {
  private blockchain: Blockchain;

  constructor(blockchain: Blockchain) {
    this.blockchain = blockchain;
  }

  public getBlockchainStats() {
    const chain = this.blockchain.getChain();
    if (chain.length === 0) {
      throw new Error("Blockchain is empty.");
    }

    const pendingTransactions = this.blockchain.getPendingTransactions();
    const uniqueAddresses = new Set<string>();

    let totalTransactions = pendingTransactions.length;

    for (const block of chain) {
      totalTransactions += block.transactions.length;
      for (const tx of block.transactions) {
        if (tx.fromAddress) uniqueAddresses.add(tx.fromAddress);
        if (tx.toAddress) uniqueAddresses.add(tx.toAddress);
      }
    }

    return {
      totalBlocks: chain.length,
      totalTransactions,
      activeWallets: uniqueAddresses.size,
      hashRate: this.calculateHashRate(chain),
      difficulty: this.blockchain.getDifficulty(),
    };
  }

  public getLatestBlocks(limit: number): Block[] {
    const chain = this.blockchain.getChain();
    if (limit <= 0) {
      throw new Error("Limit must be greater than 0.");
    }
    return chain.slice(-limit).reverse();
  }

  public getLatestTransactions(limit: number): Transaction[] {
    if (limit <= 0) {
      throw new Error("Limit must be greater than 0.");
    }

    const chain = this.blockchain.getChain();
    const pendingTransactions = this.blockchain.getPendingTransactions();
    const blockTransactions = chain
      .slice(-10)
      .flatMap(block => block.transactions);

    return [...blockTransactions, ...pendingTransactions]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  public getAddressStats(address: string) {
    const chain = this.blockchain.getChain();
    const pendingTransactions = this.blockchain.getPendingTransactions();

    let sent = 0;
    let received = 0;
    let transactionCount = 0;

    // Iterate through blocks in the chain
    for (const block of chain) {
      for (const tx of block.transactions) {
        if (tx.fromAddress === address) {
          sent += tx.amount;
          transactionCount++;
        }
        if (tx.toAddress === address) {
          received += tx.amount;
          transactionCount++;
        }
      }
    }

    // Include pending transactions
    for (const tx of pendingTransactions) {
      if (tx.fromAddress === address) {
        sent += tx.amount;
        transactionCount++;
      }
      if (tx.toAddress === address) {
        received += tx.amount;
        transactionCount++;
      }
    }

    return {
      sent,
      received,
      transactionCount,
      balance: received - sent,
    };
  }

  public getTransaction(hash: string): Transaction | null {
    const chain = this.blockchain.getChain();
    const pendingTransactions = this.blockchain.getPendingTransactions();

    // Search in the blockchain
    for (const block of chain) {
      for (const tx of block.transactions) {
        if (tx.hash === hash) {
          return tx;
        }
      }
    }

    // Search in pending transactions
    for (const tx of pendingTransactions) {
      if (tx.hash === hash) {
        return tx;
      }
    }

    return null; // Return null if no transaction is found
  }

  private calculateHashRate(chain: Block[]): string {
    if (chain.length < 2) return '0 H/s';

    const recentBlocks = chain.slice(-10);
    const startTimestamp = recentBlocks[0].timestamp;
    const endTimestamp = recentBlocks[recentBlocks.length - 1].timestamp;

    if (startTimestamp >= endTimestamp) {
      return '0 H/s';
    }

    const timeSpan = endTimestamp - startTimestamp;
    const hashesComputed = recentBlocks.reduce((total, block) => total + block.nonce, 0);

    const hashesPerSecond = hashesComputed / (timeSpan / 1000);

    if (hashesPerSecond > 1e9) return `${(hashesPerSecond / 1e9).toFixed(2)} GH/s`;
    if (hashesPerSecond > 1e6) return `${(hashesPerSecond / 1e6).toFixed(2)} MH/s`;
    if (hashesPerSecond > 1e3) return `${(hashesPerSecond / 1e3).toFixed(2)} KH/s`;

    return `${Math.floor(hashesPerSecond)} H/s`;
  }
}
