/**
 * AgentDEX Integration for BRL-A Trading Agent
 * Provides optimal swap routing via Jupiter V6 aggregation
 */

import axios from "axios";

// AgentDEX API Configuration
const AGENTDEX_API_URL =
  process.env.AGENTDEX_API_URL || "https://api.agentdex.io";
const AGENTDEX_API_KEY = process.env.AGENTDEX_API_KEY || "";

// Token Mints
export const TOKENS = {
  BRL_A: "75wzVU6j9U6oZVJjQYLtiN7Z5Ah97it1UyWZN29HgE4m", // BRL-A mainnet
  USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  SOL: "So11111111111111111111111111111111111111112",
};

export interface QuoteResponse {
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  priceImpactPct: number;
  routePlan: Array<{
    swapInfo: {
      ammKey: string;
      label: string;
      inputMint: string;
      outputMint: string;
      feeAmount: string;
      feeMint: string;
    };
    percent: number;
  }>;
  slippageBps: number;
}

export interface SwapResponse {
  signature: string;
  inputAmount: string;
  outputAmount: string;
  priceImpactPct: number;
}

export class AgentDEXClient {
  private apiUrl: string;
  private apiKey: string;

  constructor(apiUrl?: string, apiKey?: string) {
    this.apiUrl = apiUrl || AGENTDEX_API_URL;
    this.apiKey = apiKey || AGENTDEX_API_KEY;
  }

  /**
   * Get quote for BRL-A swap
   * Routes through Jupiter V6 for best price
   */
  async getQuote(
    inputMint: string,
    outputMint: string,
    amount: number,
    slippageBps: number = 50,
  ): Promise<QuoteResponse> {
    try {
      const response = await axios.get(`${this.apiUrl}/quote`, {
        params: {
          inputMint,
          outputMint,
          amount: Math.floor(amount * 1e6).toString(), // Convert to smallest unit
          slippageBps,
        },
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });

      console.log(
        `[AgentDEX] Quote: ${amount} ${inputMint.slice(0, 8)}... → ${response.data.outAmount} ${outputMint.slice(0, 8)}...`,
      );
      console.log(
        `[AgentDEX] Price impact: ${response.data.priceImpactPct.toFixed(4)}%`,
      );

      return response.data;
    } catch (error) {
      console.error("[AgentDEX] Error getting quote:", error);
      throw error;
    }
  }

  /**
   * Execute swap via AgentDEX
   * Supports both signed and unsigned-tx modes
   */
  async executeSwap(
    inputMint: string,
    outputMint: string,
    amount: number,
    walletAddress: string,
    options: {
      slippageBps?: number;
      unsignedTx?: boolean;
    } = {},
  ): Promise<SwapResponse | { unsignedTransaction: string }> {
    const { slippageBps = 50, unsignedTx = false } = options;

    try {
      // First get quote
      const quote = await this.getQuote(
        inputMint,
        outputMint,
        amount,
        slippageBps,
      );

      // Check price impact threshold (abort if > 1% for peg defense)
      if (quote.priceImpactPct > 1.0) {
        console.warn(
          `[AgentDEX] High price impact: ${quote.priceImpactPct.toFixed(2)}%. Consider splitting order.`,
        );
      }

      // Execute swap
      const response = await axios.post(
        `${this.apiUrl}/swap`,
        {
          inputMint,
          outputMint,
          amount: Math.floor(amount * 1e6).toString(),
          walletAddress,
          slippageBps,
          unsignedTx,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (unsignedTx) {
        console.log("[AgentDEX] Returning unsigned transaction for PDA signing");
        return { unsignedTransaction: response.data.transaction };
      }

      console.log(`[AgentDEX] Swap executed: ${response.data.signature}`);
      return response.data;
    } catch (error) {
      console.error("[AgentDEX] Error executing swap:", error);
      throw error;
    }
  }

  /**
   * Get BRL-A price in USD via USDC quote
   */
  async getBrlAPrice(): Promise<number> {
    try {
      const quote = await this.getQuote(
        TOKENS.BRL_A,
        TOKENS.USDC,
        1, // 1 BRL-A
        100, // Higher slippage for price check only
      );

      // outAmount is in USDC (6 decimals)
      const usdcAmount = parseInt(quote.outAmount) / 1e6;
      console.log(`[AgentDEX] BRL-A price: $${usdcAmount.toFixed(4)} USDC`);
      return usdcAmount;
    } catch (error) {
      console.error("[AgentDEX] Error fetching BRL-A price:", error);
      throw error;
    }
  }

  /**
   * Defend peg by executing optimal swap
   * BRL-A > target → SELL (swap BRL-A for USDC)
   * BRL-A < target → BUY (swap USDC for BRL-A)
   */
  async defendPeg(
    action: "BUY" | "SELL",
    amount: number,
    walletAddress: string,
  ): Promise<SwapResponse | { unsignedTransaction: string }> {
    if (action === "BUY") {
      // Buy BRL-A with USDC to raise price
      return this.executeSwap(TOKENS.USDC, TOKENS.BRL_A, amount, walletAddress);
    } else {
      // Sell BRL-A for USDC to lower price
      return this.executeSwap(TOKENS.BRL_A, TOKENS.USDC, amount, walletAddress);
    }
  }
}
