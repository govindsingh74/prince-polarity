import { Blockchain } from './blockchain/Blockchain';
import { Transaction } from './blockchain/Transaction';
import { SmartContract } from './blockchain/SmartContract';
import { BlockchainScanner } from './scanner/Scanner';
import { ec as EC } from 'elliptic';

// Initialize the elliptic curve for key generation
const ec = new EC('secp256k1');

// Initialize blockchain
const blockchain = new Blockchain();
console.log('Blockchain initialized with Polarity Clock');

// Initialize scanner
const scanner = new BlockchainScanner(blockchain);

// Create a wallet for testing
const myKey = ec.genKeyPair();
const myWalletAddress = myKey.getPublic('hex');

console.log('\nWallet created:');
console.log('Public key:', myWalletAddress);

// Create and deploy a test token
const tokenId = blockchain.createToken(
  'Test Token',
  'TST',
  18,
  myWalletAddress,
  '1000000000000000000000000' // 1 million tokens
);

console.log('\nToken created:');
console.log('Token ID:', tokenId);

// Create a test transaction
const tx1 = new Transaction(myWalletAddress, 'recipient-address', 10);
tx1.signTransaction(myKey);
blockchain.addTransaction(tx1);

// Deploy a test smart contract
const contract = new SmartContract('contract-address', myWalletAddress);
contract.setCode(`
  state.counter = (state.counter || 0) + 1;
  if (context.value > 0) {
    state.lastDeposit = context.value;
  }
`);
blockchain.deployContract(contract);

// Wait for a few blocks to be created
setTimeout(() => {
  // Display blockchain statistics
  console.log('\nBlockchain Statistics:');
  console.log(scanner.getBlockchainStats());

  // Display latest blocks
  console.log('\nLatest Blocks:');
  console.log(scanner.getLatestBlocks(5));

  // Display wallet information
  console.log('\nWallet Information:');
  console.log(scanner.getAddressStats(myWalletAddress));

  // Display transaction information
  console.log('\nTransaction Information:');
  console.log(scanner.getTransaction(tx1.hash));
}, 2000);