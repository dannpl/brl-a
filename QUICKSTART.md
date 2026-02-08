# BRL-A Quick Start Guide

## 🚀 Run Everything

### 1. Oracle (Already Deployed)

```bash
# Oracle is live on devnet
# Program ID: 3vfDXoNmvKJL2Neb51yjjvaudVhwCqDG3wGqhsx84swe
```

### 2. Trading Agent

```bash
cd agent
npm install
cp .env.example .env

# Edit .env and add your Solana keypair:
# PRIVATE_KEY=[1,2,3,...]  # Your keypair as JSON array

npm run dev
```

**Expected output:**

```
🤖 BRL-A Agent starting...
📊 Update interval: 60s
💰 Trade amount: 100 BRL-A

============================================================
[2026-02-08T04:36:00.000Z] Agent Iteration
============================================================
[Oracle] USD/BRL Price: 5.8500
[Oracle] Updating on-chain price to: 5850000 (5.85 BRL)
[Oracle] Price updated successfully
[Peg Monitor] Current: 1.0000 BRL | Target: 1.0000 BRL | Deviation: 0.00%
[Trading] No action needed, peg is stable

📈 Summary:
   USD/BRL: 5.8500
   BRL-A Price: 1.0000 BRL
   Peg Status: ✅ Stable
   Deviation: 0.00%
   Action: HOLD
```

### 3. Dashboard

```bash
cd dashboard
npm install
npm run dev
```

Open http://localhost:3000

## 📊 What You'll See

**Dashboard shows:**

- ✅ Agent status (Running/Stopped)
- ✅ USD/BRL price from Oracle
- ✅ BRL-A price and peg deviation
- ✅ Last action (BUY/SELL/HOLD)
- ✅ Total trades executed

**Agent logs show:**

- Real-time USD/BRL price fetching
- Oracle updates
- Peg monitoring
- Autonomous trading decisions

## 🎬 Demo Flow

1. **Start Dashboard** → See live monitoring
2. **Start Agent** → Watch autonomous loop
3. **Show Oracle Updates** → Real USD/BRL prices
4. **Show Peg Monitoring** → ±2% tolerance
5. **Show Trading Logic** → BUY/SELL/HOLD decisions

## 🔗 Important Links

- **BRL-A Token (Mainnet)**: `75wzVU6j9U6oZVJjQYLtiN7Z5Ah97it1UyWZN29HgE4m`
- **Oracle (Devnet)**: `3vfDXoNmvKJL2Neb51yjjvaudVhwCqDG3wGqhsx84swe`
- **Triad Protocol**: `TRDwq3BN4mP3m9KsuNUWSN6QDff93VKGSwE95Jbr9Ss`

## 💡 Key Features

- **Autonomous**: Agent runs 24/7 without human intervention
- **Real Oracle**: Fetches live USD/BRL from AwesomeAPI
- **Peg Maintenance**: Keeps BRL-A at 1:1 with BRL
- **Production Ready**: Live token on Solana mainnet
