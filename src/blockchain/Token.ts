import { SHA256 } from 'crypto-js';
import BigNumber from 'bignumber.js';

export class Token {
  private balances: Map<string, BigNumber>;
  private allowances: Map<string, Map<string, BigNumber>>;
  public totalSupply: BigNumber;

  constructor(
    public name: string,
    public symbol: string,
    public decimals: number,
    public owner: string,
    initialSupply: number | string
  ) {
    this.balances = new Map();
    this.allowances = new Map();
    this.totalSupply = new BigNumber(initialSupply);
    this.balances.set(owner, this.totalSupply);
  }

  mint(to: string, amount: number | string): boolean {
    const mintAmount = new BigNumber(amount);
    if (mintAmount.isLessThanOrEqualTo(0)) return false;

    const currentBalance = this.balances.get(to) || new BigNumber(0);
    this.balances.set(to, currentBalance.plus(mintAmount));
    this.totalSupply = this.totalSupply.plus(mintAmount);
    return true;
  }

  burn(from: string, amount: number | string): boolean {
    const burnAmount = new BigNumber(amount);
    const currentBalance = this.balances.get(from) || new BigNumber(0);

    if (burnAmount.isLessThanOrEqualTo(0) || burnAmount.isGreaterThan(currentBalance)) {
      return false;
    }

    this.balances.set(from, currentBalance.minus(burnAmount));
    this.totalSupply = this.totalSupply.minus(burnAmount);
    return true;
  }

  transfer(from: string, to: string, amount: number | string): boolean {
    const transferAmount = new BigNumber(amount);
    const fromBalance = this.balances.get(from) || new BigNumber(0);

    if (transferAmount.isLessThanOrEqualTo(0) || transferAmount.isGreaterThan(fromBalance)) {
      return false;
    }

    const toBalance = this.balances.get(to) || new BigNumber(0);
    this.balances.set(from, fromBalance.minus(transferAmount));
    this.balances.set(to, toBalance.plus(transferAmount));
    return true;
  }

  approve(owner: string, spender: string, amount: number | string): boolean {
    if (!this.allowances.has(owner)) {
      this.allowances.set(owner, new Map());
    }
    this.allowances.get(owner)?.set(spender, new BigNumber(amount));
    return true;
  }

  transferFrom(spender: string, from: string, to: string, amount: number | string): boolean {
    const transferAmount = new BigNumber(amount);
    const allowance = this.allowances.get(from)?.get(spender) || new BigNumber(0);

    if (transferAmount.isGreaterThan(allowance)) {
      return false;
    }

    if (!this.transfer(from, to, transferAmount.toString())) {
      return false;
    }

    this.allowances.get(from)?.set(spender, allowance.minus(transferAmount));
    return true;
  }

  balanceOf(account: string): BigNumber {
    return this.balances.get(account) || new BigNumber(0);
  }

  allowanceOf(owner: string, spender: string): BigNumber {
    return this.allowances.get(owner)?.get(spender) || new BigNumber(0);
  }
}