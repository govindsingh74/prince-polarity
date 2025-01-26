import React from 'react';

interface TokenInfoProps {
  info: {
    price: string;
    marketCap: string;
    volume24h: string;
    circulatingSupply: string;
    holders: string;
  } | null;
}

function TokenInfo({ info }: TokenInfoProps) {
  if (!info) return null;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 mb-8 text-white">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div>
          <div className="text-sm font-medium opacity-80">Price</div>
          <div className="text-2xl font-bold mt-1">{info.price}</div>
        </div>
        <div>
          <div className="text-sm font-medium opacity-80">Market Cap</div>
          <div className="text-2xl font-bold mt-1">{info.marketCap}</div>
        </div>
        <div>
          <div className="text-sm font-medium opacity-80">24h Volume</div>
          <div className="text-2xl font-bold mt-1">{info.volume24h}</div>
        </div>
        <div>
          <div className="text-sm font-medium opacity-80">Circulating Supply</div>
          <div className="text-2xl font-bold mt-1">{info.circulatingSupply}</div>
        </div>
        <div>
          <div className="text-sm font-medium opacity-80">Holders</div>
          <div className="text-2xl font-bold mt-1">{info.holders}</div>
        </div>
      </div>
    </div>
  );
}

export default TokenInfo;