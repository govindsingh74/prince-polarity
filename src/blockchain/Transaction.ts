import { SHA256 } from 'crypto-js';
import { ec as EC } from 'elliptic';

const ec = new EC('secp256k1');

export class Transaction {
  public signature: string = ''; // Digital signature for the transaction
  public timestamp: number; // Timestamp of when the transaction was created
  public hash: string; // Hash of the transaction

  constructor(
    public fromAddress: string | null, // Address of the sender (null for mining rewards)
    public toAddress: string, // Address of the recipient
    public amount: number, // Amount being transferred
    public data: any = {} // Optional additional data for the transaction
  ) {
    this.timestamp = Date.now();
    this.hash = this.calculateHash(); // Calculate transaction hash on initialization
  }

  /**
   * Calculates the hash of the transaction.
   * Includes the `fromAddress`, `toAddress`, `amount`, `timestamp`, and `data`.
   */
  calculateHash(): string {
    return SHA256(
      this.fromAddress +
        this.toAddress +
        this.amount +
        this.timestamp +
        JSON.stringify(this.data)
    ).toString();
  }

  /**
   * Signs the transaction with the given private key.
   * Ensures that only the owner of the `fromAddress` can sign the transaction.
   * 
   * @param signingKey - The elliptic curve key pair used to sign the transaction.
   * @throws Error if the signing key does not match the `fromAddress`.
   */
  signTransaction(signingKey: EC.KeyPair): void {
    if (signingKey.getPublic('hex') !== this.fromAddress) {
      throw new Error('You cannot sign transactions for other wallets!');
    }

    const hashTx = this.calculateHash();
    const sig = signingKey.sign(hashTx, 'base64');
    this.signature = sig.toDER('hex');
  }

  /**
   * Validates the transaction.
   * For mining reward transactions (where `fromAddress` is null), the transaction is always valid.
   * 
   * @returns `true` if the transaction is valid, otherwise throws an error.
   * @throws Error if the signature is missing or invalid.
   */
  isValid(): boolean {
    // Mining rewards or system-generated transactions are valid by default
    if (this.fromAddress === null) return true;

    // Check for the existence of a signature
    if (!this.signature || this.signature.length === 0) {
      throw new Error('No signature in this transaction');
    }

    // Verify the signature using the sender's public key
    const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
    return publicKey.verify(this.calculateHash(), this.signature);
  }
}
