import BigNumber from 'bignumber.js';
import { Transaction } from '../blockchain/Transaction';

export class LiquidityPool {
  private token0Balance: BigNumber;
  private token1Balance: BigNumber;
  private shares: Map<string, BigNumber>;
  private constant: BigNumber;

  constructor(
    public token0Address: string,
    public token1Address: string
  ) {
    this.token0Balance = new BigNumber(0);
    this.token1Balance = new BigNumber(0);
    this.shares = new Map();
    this.constant = new BigNumber(0);
  }

  addLiquidity(
    provider: string,
    token0Amount: BigNumber,
    token1Amount: BigNumber
  ): void {
    if (this.token0Balance.isZero() && this.token1Balance.isZero()) {
      // Initial liquidity
      this.shares.set(provider, new BigNumber(100));
    } else {
      const share = token0Amount
        .times(this.getTotalShares())
        .dividedBy(this.token0Balance);
      this.shares.set(provider, (this.shares.get(provider) || new BigNumber(0)).plus(share));
    }

    this.token0Balance = this.token0Balance.plus(token0Amount);
    this.token1Balance = this.token1Balance.plus(token1Amount);
    this.constant = this.token0Balance.times(this.token1Balance);
  }

  swap(
    tokenInAddress: string,
    amountIn: BigNumber
  ): BigNumber {
    const isToken0 = tokenInAddress === this.token0Address;
    const [balanceIn, balanceOut] = isToken0
      ? [this.token0Balance, this.token1Balance]
      : [this.token1Balance, this.token0Balance];

    // Calculate amount out using constant product formula
    const amountOut = balanceOut.minus(
      this.constant.dividedBy(balanceIn.plus(amountIn))
    );

    if (isToken0) {
      this.token0Balance = this.token0Balance.plus(amountIn);
      this.token1Balance = this.token1Balance.minus(amountOut);
    } else {
      this.token1Balance = this.token1Balance.plus(amountIn);
      this.token0Balance = this.token0Balance.minus(amountOut);
    }

    return amountOut;
  }

  removeLiquidity(
    provider: string,
    shareAmount: BigNumber
  ): [BigNumber, BigNumber] {
    const providerShare = this.shares.get(provider) || new BigNumber(0);
    if (shareAmount.isGreaterThan(providerShare)) {
      throw new Error('Insufficient shares');
    }

    const shareRatio = shareAmount.dividedBy(this.getTotalShares());
    const token0Amount = this.token0Balance.times(shareRatio);
    const token1Amount = this.token1Balance.times(shareRatio);

    this.shares.set(provider, providerShare.minus(shareAmount));
    this.token0Balance = this.token0Balance.minus(token0Amount);
    this.token1Balance = this.token1Balance.minus(token1Amount);

    return [token0Amount, token1Amount];
  }

  getTotalShares(): BigNumber {
    return Array.from(this.shares.values()).reduce(
      (total, share) => total.plus(share),
      new BigNumber(0)
    );
  }

  getReserves(): [BigNumber, BigNumber] {
    return [this.token0Balance, this.token1Balance];
  }
}