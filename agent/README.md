# BRL-A Trading Agent

Autonomous market maker for BRL-A stablecoin on Solana.

## Features

- **USD/BRL Oracle**: Fetches real-time USD/BRL price and updates on-chain Oracle
- **Peg Monitor**: Tracks BRL-A price stability (target: 1 BRL-A = 1 BRL)
- **Trading Engine**: Executes autonomous trades to maintain peg

## Setup

```bash
npm install
cp .env.example .env
# Edit .env with your credentials
```

## Environment Variables

```env
RPC_URL=https://api.devnet.solana.com
PRIVATE_KEY=[1,2,3,...]  # Your Solana keypair as JSON array
```

## Run

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## How It Works

1. **Fetch USD/BRL Price** from AwesomeAPI (Brazilian API)
2. **Update Oracle** on-chain with latest price
3. **Monitor BRL-A Price** on Triadmarkets Protocol
4. **Check Peg Stability** (±2% tolerance)
5. **Execute Trades** if peg drifts:
   - If BRL-A > 1.02 BRL → SELL
   - If BRL-A < 0.98 BRL → BUY
   - Otherwise → HOLD

## Architecture

```
┌─────────────────┐
│  External APIs  │  (USD/BRL price)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Price Oracle   │  (fetch & update)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Peg Monitor   │  (check stability)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Trading Engine  │  (execute trades)
└─────────────────┘
```
