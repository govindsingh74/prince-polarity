import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

interface Transaction {
  hash: string;
  from: string;
  to: string;
  amount: number;
  timestamp: number;
}

interface RecentActivityProps {
  transactions: Transaction[];
}

function RecentActivity({ transactions }: RecentActivityProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Latest Transactions</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {transactions.map((tx) => (
          <div key={tx.hash} className="px-6 py-4 hover:bg-gray-50">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/tx/${tx.hash}`} className="text-sm font-medium text-blue-600 hover:text-blue-800 truncate">
                  {tx.hash}
                </Link>
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <span className="truncate">From: {tx.from.substring(0, 8)}...</span>
                  <span className="mx-1">→</span>
                  <span className="truncate">To: {tx.to.substring(0, 8)}...</span>
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="text-sm font-medium text-gray-900">
                  {tx.amount} POLARITY
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  {formatDistanceToNow(tx.timestamp, { addSuffix: true })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentActivity;