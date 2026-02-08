import { PriceOracle, PegMonitor, TradingEngine } from "./core.js";

// Agent configuration
const UPDATE_INTERVAL = 60_000; // 60 seconds
const TRADE_AMOUNT = 100; // 100 BRL-A per trade

class BrlAgent {
  private oracle: PriceOracle;
  private pegMonitor: PegMonitor;
  private tradingEngine: TradingEngine;
  private isRunning: boolean = false;

  constructor() {
    this.oracle = new PriceOracle();
    this.pegMonitor = new PegMonitor();
    this.tradingEngine = new TradingEngine();
  }

  /**
   * Main agent loop
   */
  async start(): void {
    console.log("🤖 BRL-A Agent starting...");
    console.log(`📊 Update interval: ${UPDATE_INTERVAL / 1000}s`);
    console.log(`💰 Trade amount: ${TRADE_AMOUNT} BRL-A\n`);

    this.isRunning = true;

    while (this.isRunning) {
      try {
        await this.run();
      } catch (error) {
        console.error("❌ Error in agent loop:", error);
      }

      // Wait before next iteration
      await this.sleep(UPDATE_INTERVAL);
    }
  }

  /**
   * Single agent iteration
   */
  private async run(): Promise<void> {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`[${new Date().toISOString()}] Agent Iteration`);
    console.log("=".repeat(60));

    // 1. Fetch USD/BRL price
    const usdBrlPrice = await this.oracle.fetchUsdBrlPrice();

    // 2. Update Oracle on-chain
    await this.oracle.updateOnChainPrice(usdBrlPrice);

    // 3. Get BRL-A price from Triadmarkets
    const brlAPrice = await this.tradingEngine.getBrlAPrice();

    // 4. Check peg stability
    const { isStable, deviation } = this.pegMonitor.checkPeg(brlAPrice);

    // 5. Determine action
    const action = this.pegMonitor.getAction(brlAPrice);

    // 6. Execute trade if needed
    if (action !== "HOLD") {
      await this.tradingEngine.executeTrade(action, TRADE_AMOUNT);
    }

    // 7. Log summary
    console.log("\n📈 Summary:");
    console.log(`   USD/BRL: ${usdBrlPrice.toFixed(4)}`);
    console.log(`   BRL-A Price: ${brlAPrice.toFixed(4)} BRL`);
    console.log(`   Peg Status: ${isStable ? "✅ Stable" : "⚠️  Unstable"}`);
    console.log(`   Deviation: ${(deviation * 100).toFixed(2)}%`);
    console.log(`   Action: ${action}`);
  }

  /**
   * Stop the agent
   */
  stop(): void {
    console.log("\n🛑 Stopping BRL-A Agent...");
    this.isRunning = false;
  }

  /**
   * Sleep helper
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Start agent
const agent = new BrlAgent();

// Handle graceful shutdown
process.on("SIGINT", () => {
  agent.stop();
  process.exit(0);
});

process.on("SIGTERM", () => {
  agent.stop();
  process.exit(0);
});

// Start the agent
agent.start().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
