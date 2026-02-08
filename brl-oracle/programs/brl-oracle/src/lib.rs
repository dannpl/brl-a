use anchor_lang::prelude::*;

declare_id!("3vfDXoNmvKJL2Neb51yjjvaudVhwCqDG3wGqhsx84swe");

#[program]
pub mod brl_oracle {
    use super::*;

    pub fn initialize_oracle(ctx: Context<InitializeOracle>) -> Result<()> {
        let oracle = &mut ctx.accounts.oracle;
        oracle.authority = ctx.accounts.authority.key();
        oracle.usd_brl_price = 0;
        oracle.last_update = Clock::get()?.unix_timestamp;
        oracle.bump = ctx.bumps.oracle;

        msg!("BRL Oracle initialized by authority: {}", oracle.authority);
        Ok(())
    }

    pub fn update_price(ctx: Context<UpdatePrice>, usd_brl_price: u64) -> Result<()> {
        let oracle = &mut ctx.accounts.oracle;

        require!(ctx.accounts.authority.key() == oracle.authority, OracleError::Unauthorized);

        oracle.usd_brl_price = usd_brl_price;
        oracle.last_update = Clock::get()?.unix_timestamp;

        msg!("Price updated to: {} (6 decimals)", usd_brl_price);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeOracle<'info> {
    #[account(
        init,
        payer = authority,
        space = PriceOracle::SPACE,
        seeds = [PriceOracle::SEED],
        bump
    )]
    pub oracle: Account<'info, PriceOracle>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdatePrice<'info> {
    #[account(
        mut,
        seeds = [PriceOracle::SEED],
        bump = oracle.bump
    )]
    pub oracle: Account<'info, PriceOracle>,

    pub authority: Signer<'info>,
}

#[account]
pub struct PriceOracle {
    pub authority: Pubkey, // 32
    pub usd_brl_price: u64, // 8 (price with 6 decimals, e.g., 5_850_000 = 5.85 BRL)
    pub last_update: i64, // 8
    pub bump: u8, // 1
}

impl PriceOracle {
    pub const SEED: &'static [u8] = b"price_oracle";
    pub const SPACE: usize = 8 + 32 + 8 + 8 + 1;
}

#[error_code]
pub enum OracleError {
    #[msg("Unauthorized: only authority can update price")]
    Unauthorized,
}
