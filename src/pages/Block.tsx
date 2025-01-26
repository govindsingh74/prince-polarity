import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

function Block() {
  const { height } = useParams();
  const [block, setBlock] = useState<any>(null);

  useEffect(() => {
    // Simulated block data fetch
    setBlock({
      blockHeight: parseInt(height || '0'),
      timestamp: Date.now(),
      hash: `0x${Math.random().toString(16).slice(2)}`,
      nonce: Math.floor(Math.random() * 1000000),
      difficulty: 4,
      previousHash: `0x${Math.random().toString(16).slice(2)}`
    });
  }, [height]);

  if (!block) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Block #{block.blockHeight}
          </h2>
        </div>
        <div className="p-6">
          <dl className="grid grid-cols-1 gap-4">
            <div className="flex justify-between py-3 border-b">
              <dt className="text-gray-600">Timestamp</dt>
              <dd className="text-gray-900">
                {formatDistanceToNow(block.timestamp, { addSuffix: true })}
              </dd>
            </div>
            <div className="flex justify-between py-3 border-b">
              <dt className="text-gray-600">Hash</dt>
              <dd className="text-gray-900 font-mono">{block.hash}</dd>
            </div>
            <div className="flex justify-between py-3 border-b">
              <dt className="text-gray-600">Previous Hash</dt>
              <dd className="text-gray-900 font-mono">{block.previousHash}</dd>
            </div>
            <div className="flex justify-between py-3 border-b">
              <dt className="text-gray-600">Nonce</dt>
              <dd className="text-gray-900">{block.nonce}</dd>
            </div>
            <div className="flex justify-between py-3">
              <dt className="text-gray-600">Difficulty</dt>
              <dd className="text-gray-900">{block.difficulty}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

export default Block;