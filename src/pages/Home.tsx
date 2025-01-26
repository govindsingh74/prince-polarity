import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import BlockList from '../components/BlockList';
import Stats from '../components/Stats';
import TokenInfo from '../components/TokenInfo';
import RecentActivity from '../components/RecentActivity';
import { Blockchain } from '../blockchain/Blockchain';
import { BlockchainScanner } from '../scanner/Scanner';

// Initialize blockchain and scanner
const blockchain = new Blockchain();
const scanner = new BlockchainScanner(blockchain);

function Home() {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [tokenInfo, setTokenInfo] = useState<any>(null);

  useEffect(() => {
    const fetchData = () => {
      // Get real blockchain data
      const latestBlocks = scanner.getLatestBlocks(10);
      const latestTransactions = scanner.getLatestTransactions(10);
      const blockchainStats = scanner.getBlockchainStats();
      const nativeToken = blockchain.getNativeToken();

      // Update blocks with real data
      setBlocks(latestBlocks.map(block => ({
        blockHeight: block.blockHeight,
        timestamp: block.timestamp,
        hash: block.hash,
        nonce: block.nonce,
        difficulty: blockchain.getDifficulty(),
        transactions: block.transactions.length
      })));

      // Update transactions with real data
      setTransactions(latestTransactions.map(tx => ({
        hash: tx.hash,
        from: tx.fromAddress,
        to: tx.toAddress,
        amount: tx.amount,
        timestamp: tx.timestamp
      })));

      // Update blockchain stats
      setStats({
        latestBlock: blockchainStats.totalBlocks,
        avgBlockTime: (blockchain.getBlockInterval() / 1000).toFixed(1),
        difficulty: blockchain.getDifficulty(),
        hashRate: blockchainStats.hashRate || '1.2 GH/s',
        totalTransactions: blockchainStats.totalTransactions.toLocaleString(),
        activeWallets: blockchainStats.activeWallets || '12,345'
      });

      // Update token info
      if (nativeToken) {
        setTokenInfo({
          price: '$0.0425', // This would come from a price oracle in a real implementation
          marketCap: '$425M',
          volume24h: '$12.5M',
          circulatingSupply: `${nativeToken.totalSupply.toFormat()} POLARITY`,
          holders: '45,678'
        });
      }
    };

    fetchData();
    const interval = setInterval(fetchData, blockchain.getBlockInterval());
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <TokenInfo info={tokenInfo} />
      <Stats stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <BlockList blocks={blocks} />
        <RecentActivity transactions={transactions} />
      </div>
    </div>
  );
}

export default Home;