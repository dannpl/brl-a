'use client';

import { useState, useEffect } from 'react';

interface AgentStatus {
  isRunning: boolean;
  lastUpdate: string;
  usdBrlPrice: number;
  brlAPrice: number;
  pegDeviation: number;
  lastAction: 'BUY' | 'SELL' | 'HOLD';
  totalTrades: number;
}

export default function Dashboard() {
  const [status, setStatus] = useState<AgentStatus>({
    isRunning: true,
    lastUpdate: new Date().toISOString(),
    usdBrlPrice: 5.85,
    brlAPrice: 1.01,
    pegDeviation: 0.01,
    lastAction: 'SELL',
    totalTrades: 42,
  });

  useEffect(() => {
    // TODO: Fetch real agent status from API
    const interval = setInterval(() => {
      setStatus(prev => ({
        ...prev,
        lastUpdate: new Date().toISOString(),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const isPegStable = status.pegDeviation <= 0.02;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            BRL-A Agent Dashboard
          </h1>
          <p className="text-gray-400 text-lg">
            Autonomous market maker for BRL stablecoin • Live on Solana
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Agent Status */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 text-sm font-medium">Agent Status</h3>
              <div className={`w-3 h-3 rounded-full ${status.isRunning ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            </div>
            <p className="text-3xl font-bold">
              {status.isRunning ? 'Running' : 'Stopped'}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Last update: {new Date(status.lastUpdate).toLocaleTimeString()}
            </p>
          </div>

          {/* USD/BRL Price */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
            <h3 className="text-gray-400 text-sm font-medium mb-4">USD/BRL Oracle</h3>
            <p className="text-3xl font-bold">{status.usdBrlPrice.toFixed(4)}</p>
            <p className="text-gray-500 text-sm mt-2">Brazilian Real per USD</p>
          </div>

          {/* BRL-A Price */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
            <h3 className="text-gray-400 text-sm font-medium mb-4">BRL-A Price</h3>
            <p className="text-3xl font-bold">{status.brlAPrice.toFixed(4)} BRL</p>
            <p className="text-gray-500 text-sm mt-2">Target: 1.0000 BRL</p>
          </div>

          {/* Total Trades */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
            <h3 className="text-gray-400 text-sm font-medium mb-4">Total Trades</h3>
            <p className="text-3xl font-bold">{status.totalTrades}</p>
            <p className="text-gray-500 text-sm mt-2">Autonomous executions</p>
          </div>
        </div>

        {/* Peg Stability */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700 mb-12">
          <h2 className="text-2xl font-bold mb-6">Peg Stability</h2>
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gray-400 mb-2">Current Deviation</p>
              <p className="text-4xl font-bold">
                {(status.pegDeviation * 100).toFixed(2)}%
              </p>
            </div>
            
            <div className={`px-6 py-3 rounded-xl font-semibold ${
              isPegStable 
                ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                : 'bg-red-500/20 text-red-400 border border-red-500/50'
            }`}>
              {isPegStable ? '✓ Stable' : '⚠ Unstable'}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative h-4 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`absolute h-full transition-all duration-500 ${
                isPegStable ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(status.pegDeviation * 100 / 0.02 * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>0%</span>
            <span>2% (Tolerance)</span>
          </div>
        </div>

        {/* Last Action */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6">Last Action</h2>
          
          <div className="flex items-center gap-4">
            <div className={`px-8 py-4 rounded-xl font-bold text-2xl ${
              status.lastAction === 'BUY' 
                ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                : status.lastAction === 'SELL'
                ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                : 'bg-gray-500/20 text-gray-400 border border-gray-500/50'
            }`}>
              {status.lastAction}
            </div>
            
            <div className="text-gray-400">
              <p className="text-sm">Agent executed {status.lastAction} order</p>
              <p className="text-xs mt-1">to maintain 1:1 BRL peg</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>BRL-A Token: 75wzVU6j9U6oZVJjQYLtiN7Z5Ah97it1UyWZN29HgE4m</p>
          <p className="mt-2">Powered by Triadmarkets Protocol • Solana Mainnet</p>
        </div>
      </div>
    </div>
  );
}
