import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

interface Block {
  blockHeight: number;
  timestamp: number;
  hash: string;
  nonce: number;
  difficulty: number;
  transactions: number;
}

interface BlockListProps {
  blocks: Block[];
}

function BlockList({ blocks }: BlockListProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Latest Blocks</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {blocks.map((block) => (
          <div key={block.hash} className="px-6 py-4 hover:bg-gray-50">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <Link 
                  to={`/block/${block.blockHeight}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Block #{block.blockHeight}
                </Link>
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <span className="truncate">Hash: {block.hash.substring(0, 16)}...</span>
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="text-sm font-medium text-gray-900">
                  {block.transactions} txns
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  {formatDistanceToNow(block.timestamp, { addSuffix: true })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlockList;