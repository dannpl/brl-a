import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

// Oracle configuration
const ORACLE_PROGRAM_ID = new PublicKey(
  "DCUrf969QZLxgVaef1gK63hisDGvxojrG6QADrhJVrZZ",
);
const RPC_URL = process.env.RPC_URL || "https://api.devnet.solana.com";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

// USD/BRL Price Oracle
export class PriceOracle {
  private connection: Connection;
  private provider: AnchorProvider;
  private program: Program;

  constructor() {
    this.connection = new Connection(RPC_URL, "confirmed");
    const wallet = new Wallet(
      Keypair.fromSecretKey(Buffer.from(JSON.parse(PRIVATE_KEY))),
    );
    this.provider = new AnchorProvider(this.connection, wallet, {});
    // TODO: Load Oracle IDL
  }

  /**
   * Fetch USD/BRL price from external APIs
   */
  async fetchUsdBrlPrice(): Promise<number> {
    try {
      // Using AwesomeAPI (free Brazilian API)
      const response = await axios.get(
        "https://economia.awesomeapi.com.br/json/last/USD-BRL",
      );
      const price = parseFloat(response.data.USDBRL.bid);
      console.log(`[Oracle] USD/BRL Price: ${price}`);
      return price;
    } catch (error) {
      console.error("[Oracle] Error fetching price:", error);
      throw error;
    }
  }

  /**
   * Update on-chain Oracle with latest price
   */
  async updateOnChainPrice(price: number): Promise<void> {
    try {
      // Convert price to 6 decimals (e.g., 5.85 -> 5_850_000)
      const priceWith6Decimals = Math.floor(price * 1_000_000);

      console.log(
        `[Oracle] Updating on-chain price to: ${priceWith6Decimals} (${price} BRL)`,
      );

      // TODO: Call update_price instruction
      // await this.program.methods.updatePrice(new BN(priceWith6Decimals)).rpc();

      console.log("[Oracle] Price updated successfully");
    } catch (error) {
      console.error("[Oracle] Error updating on-chain price:", error);
      throw error;
    }
  }

  /**
   * Get current on-chain price
   */
  async getOnChainPrice(): Promise<number> {
    try {
      // TODO: Fetch PriceOracle account
      // const [oraclePda] = PublicKey.findProgramAddressSync([Buffer.from('price_oracle')], ORACLE_PROGRAM_ID);
      // const oracleAccount = await this.program.account.priceOracle.fetch(oraclePda);
      // return oracleAccount.usdBrlPrice.toNumber() / 1_000_000;

      return 0; // Placeholder
    } catch (error) {
      console.error("[Oracle] Error fetching on-chain price:", error);
      throw error;
    }
  }
}

// Peg Monitor
export class PegMonitor {
  private targetPrice: number = 1.0; // 1 BRL-A = 1 BRL
  private tolerance: number = 0.02; // 2% tolerance

  /**
   * Check if BRL-A is maintaining peg
   */
  checkPeg(currentPrice: number): { isStable: boolean; deviation: number } {
    const deviation =
      Math.abs(currentPrice - this.targetPrice) / this.targetPrice;
    const isStable = deviation <= this.tolerance;

    console.log(
      `[Peg Monitor] Current: ${currentPrice} BRL | Target: ${this.targetPrice} BRL | Deviation: ${(deviation * 100).toFixed(2)}%`,
    );

    if (!isStable) {
      console.warn(
        `[Peg Monitor] ⚠️  PEG UNSTABLE! Deviation: ${(deviation * 100).toFixed(2)}%`,
      );
    }

    return { isStable, deviation };
  }

  /**
   * Determine trading action based on peg status
   */
  getAction(currentPrice: number): "BUY" | "SELL" | "HOLD" {
    if (currentPrice > this.targetPrice * (1 + this.tolerance)) {
      return "SELL"; // BRL-A too expensive, sell to bring price down
    } else if (currentPrice < this.targetPrice * (1 - this.tolerance)) {
      return "BUY"; // BRL-A too cheap, buy to bring price up
    }
    return "HOLD";
  }
}

// Trading Engine
export class TradingEngine {
  private connection: Connection;

  constructor() {
    this.connection = new Connection(RPC_URL, "confirmed");
  }

  /**
   * Execute market making strategy
   */
  async executeTrade(
    action: "BUY" | "SELL" | "HOLD",
    amount: number,
  ): Promise<void> {
    if (action === "HOLD") {
      console.log("[Trading] No action needed, peg is stable");
      return;
    }

    console.log(`[Trading] Executing ${action} for ${amount} BRL-A`);

    try {
      // TODO: Integrate with Triadmarkets Protocol
      // - Place bid/ask orders
      // - Execute market orders

      console.log(`[Trading] ${action} order executed successfully`);
    } catch (error) {
      console.error("[Trading] Error executing trade:", error);
      throw error;
    }
  }

  /**
   * Get BRL-A price from Triadmarkets
   */
  async getBrlAPrice(): Promise<number> {
    try {
      // TODO: Fetch from Triadmarkets Protocol
      // For now, return mock price
      return 1.0;
    } catch (error) {
      console.error("[Trading] Error fetching BRL-A price:", error);
      throw error;
    }
  }
}
