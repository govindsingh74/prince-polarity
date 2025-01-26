import { Token } from './Token';
import { SHA256 } from 'crypto-js';

export class TokenFactory {
  private tokens: Map<string, Token>;

  constructor() {
    this.tokens = new Map();
  }

  createToken(
    name: string,
    symbol: string,
    decimals: number,
    owner: string,
    initialSupply: number | string
  ): string {
    const tokenId = SHA256(name + symbol + owner + Date.now()).toString();
    const token = new Token(name, symbol, decimals, owner, initialSupply);
    this.tokens.set(tokenId, token);
    return tokenId;
  }

  getToken(tokenId: string): Token | undefined {
    return this.tokens.get(tokenId);
  }

  listTokens(): Array<{ id: string; name: string; symbol: string; totalSupply: string }> {
    return Array.from(this.tokens.entries()).map(([id, token]) => ({
      id,
      name: token.name,
      symbol: token.symbol,
      totalSupply: token.totalSupply.toString()
    }));
  }
}