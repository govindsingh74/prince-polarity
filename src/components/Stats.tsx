import React from 'react';

interface StatsProps {
  stats: {
    latestBlock: number;
    avgBlockTime: string;
    difficulty: number;
    hashRate: string;
    totalTransactions: string;
    activeWallets: string;
  } | null;
}

function Stats({ stats }: StatsProps) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="text-sm font-medium text-gray-500">Latest Block</div>
        <div className="mt-1 text-xl font-semibold text-gray-900">
          #{stats.latestBlock}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="text-sm font-medium text-gray-500">Block Time</div>
        <div className="mt-1 text-xl font-semibold text-gray-900">
          {stats.avgBlockTime}s
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="text-sm font-medium text-gray-500">Difficulty</div>
        <div className="mt-1 text-xl font-semibold text-gray-900">
          {stats.difficulty}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="text-sm font-medium text-gray-500">Hash Rate</div>
        <div className="mt-1 text-xl font-semibold text-gray-900">
          {stats.hashRate}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="text-sm font-medium text-gray-500">Total Transactions</div>
        <div className="mt-1 text-xl font-semibold text-gray-900">
          {stats.totalTransactions}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="text-sm font-medium text-gray-500">Active Wallets</div>
        <div className="mt-1 text-xl font-semibold text-gray-900">
          {stats.activeWallets}
        </div>
      </div>
    </div>
  );
}

export default Stats;