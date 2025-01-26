import { ec as EC } from 'elliptic';
import { wordlist } from './wordlist';
import { SHA256 } from 'crypto-js';

const ec = new EC('secp256k1');

export class Wallet {
  private keyPair: EC.KeyPair;
  public publicKey: string;
  public privateKey: string;
  public seedPhrase: string;

  constructor(seedPhrase?: string) {
    if (seedPhrase) {
      this.seedPhrase = seedPhrase;
      // Generate deterministic private key from seed phrase
      const privateKeyHash = SHA256(seedPhrase).toString();
      this.keyPair = ec.keyFromPrivate(privateKeyHash);
    } else {
      // Generate new random wallet
      this.keyPair = ec.genKeyPair();
      this.seedPhrase = this.generateSeedPhrase();
    }

    this.publicKey = this.keyPair.getPublic('hex');
    this.privateKey = this.keyPair.getPrivate('hex');
  }

  private generateSeedPhrase(): string {
    // Generate 12 random words for the seed phrase
    const words: string[] = [];
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * wordlist.length);
      words.push(wordlist[randomIndex]);
    }
    return words.join(' ');
  }

  public sign(dataHash: string): string {
    const signature = this.keyPair.sign(dataHash);
    return signature.toDER('hex');
  }

  public verify(dataHash: string, signature: string): boolean {
    return this.keyPair.verify(dataHash, signature);
  }

  public getAddress(): string {
    return this.publicKey;
  }
}