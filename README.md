# BRL-A: Agent-Managed Payment Infrastructure

**BRL-A** is payment infrastructure for Brazilian prediction markets and entertainment platforms. An autonomous agent manages the complete payment flow: PIX on-ramp → mint stablecoin → instant settlement → burn/off-ramp.

🔗 **Live on Solana Mainnet**: `75wzVU6j9U6oZVJjQYLtiN7Z5Ah97it1UyWZN29HgE4m`

## 🎯 Problem

Brazilian gambling/betting platforms face:

- 8% FX fees (BRL → USD → BRL)
- Chargebacks
- Bank blocks
- Slow settlements

## 💡 Solution

BRL-A provides:

- **Instant settlement** (no chargebacks)
- **Low fees** (0.3-0.7% vs 8%)
- **No bank blocks** (crypto rails)
- **Autonomous peg management** (AI agent maintains 1:1 BRL backing)

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     BRL-A Ecosystem                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────┐  │
│  │   Oracle     │─────▶│    Agent     │─────▶│ Triad    │  │
│  │  (Anchor)    │      │  (Node.js)   │      │ Protocol │  │
│  └──────────────┘      └──────────────┘      └──────────┘  │
│       │                      │                     │        │
│       │ USD/BRL Price        │ Market Making       │        │
│       │                      │                     │        │
│       ▼                      ▼                     ▼        │
│  On-chain Oracle      Peg Monitoring         BRL-A/USDC    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Monorepo Structure

```
brl-a/
├── brl-oracle/          # Anchor program (USD/BRL Oracle)
│   ├── programs/
│   │   └── brl-oracle/
│   │       └── src/
│   │           └── lib.rs      # PriceOracle state + update_price
│   └── Anchor.toml
│
├── agent/               # Node.js Trading Agent
│   ├── src/
│   │   ├── core.ts             # Oracle, PegMonitor, TradingEngine
│   │   └── index.ts            # Main agent loop
│   └── package.json
│
└── dashboard/           # Next.js Analytics (TODO)
    └── app/
        └── page.tsx            # Live agent monitoring
```

## 🚀 Quick Start

### 1. Oracle Program

```bash
cd brl-oracle
anchor run build
anchor deploy --provider.cluster devnet
```

### 2. Trading Agent

```bash
cd agent
npm install
cp .env.example .env
# Edit .env with your Solana keypair
npm run dev
```

## 🤖 How the Agent Works

The agent runs autonomously every 60 seconds:

1. **Fetch USD/BRL Price** from AwesomeAPI
2. **Update Oracle** on-chain
3. **Monitor BRL-A Price** on Triadmarkets Protocol
4. **Check Peg Stability** (±2% tolerance)
5. **Execute Trades** if needed:
   - BRL-A > 1.02 BRL → SELL
   - BRL-A < 0.98 BRL → BUY
   - Otherwise → HOLD

## 📊 Demo Metrics

- **Oracle Updates**: Every 60s
- **Peg Tolerance**: ±2%
- **Trade Size**: 100 BRL-A
- **Target**: 1 BRL-A = 1 BRL

## 🎰 Use Cases

- **TrendzBR**: Prediction market whitelabel
- **PalpitXei**: Sports betting platform
- **Future**: Any Brazilian gambling/betting platform

## 💰 Revenue Model

- **Transaction Fees**: 0.3-0.7% per transaction
- **On/Off-ramp Spread**: PIX ↔ BRL-A
- **Yield on Reserves**: Brazilian government bonds
- **Premium Services**: Compliance, APIs, audits

## 📈 Market Potential

- 10 casinos × R$20M/month = **R$200M volume**
- 0.5% fee = **R$1M/month**
- **R$12M/year** (conservative estimate)

## 🔗 Links

- **Token (Mainnet)**: `75wzVU6j9U6oZVJjQYLtiN7Z5Ah97it1UyWZN29HgE4m`
- **Triad Protocol**: `TRDwq3BN4mP3m9KsuNUWSN6QDff93VKGSwE95Jbr9Ss`
- **Hackathon**: [Colosseum Agent Hackathon](https://agents.colosseum.com)

## 📝 License

MIT
