import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

function Transaction() {
  const { hash } = useParams();
  const [transaction, setTransaction] = useState<any>(null);

  useEffect(() => {
    // Simulated transaction data fetch
    setTransaction({
      hash,
      timestamp: Date.now(),
      from: `0x${Math.random().toString(16).slice(2)}`,
      to: `0x${Math.random().toString(16).slice(2)}`,
      amount: Math.floor(Math.random() * 1000),
      blockHeight: 1000000 + Math.floor(Math.random() * 10),
      status: 'Confirmed'
    });
  }, [hash]);

  if (!transaction) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Transaction Details
          </h2>
        </div>
        <div className="p-6">
          <dl className="grid grid-cols-1 gap-4">
            <div className="flex justify-between py-3 border-b">
              <dt className="text-gray-600">Transaction Hash</dt>
              <dd className="text-gray-900 font-mono">{transaction.hash}</dd>
            </div>
            <div className="flex justify-between py-3 border-b">
              <dt className="text-gray-600">Status</dt>
              <dd className="text-green-600 font-medium">{transaction.status}</dd>
            </div>
            <div className="flex justify-between py-3 border-b">
              <dt className="text-gray-600">Block</dt>
              <dd className="text-gray-900">#{transaction.blockHeight}</dd>
            </div>
            <div className="flex justify-between py-3 border-b">
              <dt className="text-gray-600">Timestamp</dt>
              <dd className="text-gray-900">
                {formatDistanceToNow(transaction.timestamp, { addSuffix: true })}
              </dd>
            </div>
            <div className="flex justify-between py-3 border-b">
              <dt className="text-gray-600">From</dt>
              <dd className="text-gray-900 font-mono">{transaction.from}</dd>
            </div>
            <div className="flex justify-between py-3 border-b">
              <dt className="text-gray-600">To</dt>
              <dd className="text-gray-900 font-mono">{transaction.to}</dd>
            </div>
            <div className="flex justify-between py-3">
              <dt className="text-gray-600">Amount</dt>
              <dd className="text-gray-900">{transaction.amount} POLARITY</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

export default Transaction;