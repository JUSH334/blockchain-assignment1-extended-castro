# blockchain-assignment1-extended-castro

A working blockchain implementation demonstrating proof-of-work mining, transaction handling, and tamper detection.

# How to Run

1. Make sure you have Node.js installed on your system
2. Navigate to the project directory
3. Run the blockchain demo:

```bash
node blockchain.js
```

The program will automatically:
- Create a blockchain with 3 blocks containing 5+ transactions
- Mine each block with difficulty level 3 (requiring hashes to start with "000")
- Validate the untampered chain
- Demonstrate tamper detection by modifying a transaction

# Console Output Screenshot

<img width="1171" height="951" alt="Screenshot from 2025-09-05 18-43-07" src="https://github.com/user-attachments/assets/9b52097e-6ccc-4ae6-bd25-8e612a42cf48" />

## Code Structure

- **Transaction Class**: Represents individual transactions with from/to/amount structure
- **Block Class**: Contains transaction arrays, implements proof-of-work mining
- **Blockchain Class**: Manages the chain, validates integrity, detects tampering
- **Demo Function**: Creates sample transactions and demonstrates all features

## Key Features Implemented

**Proof-of-Work Mining**: Difficulty level 3, shows mining attempts and resulting hashes
**Transaction Handling**: 5+ transactions stored as proper objects across multiple blocks 
**Chain Validation**: Detects tampering through hash verification 
**Console Output**: Clear demonstration of mining, validation, and tamper detection 

## Reflection

Building this blockchain implementation provided deep insights into the fundamental concepts that make cryptocurrencies secure and trustworthy. The most striking lesson was understanding how cryptographic hashing creates an immutable ledger that becomes exponentially more secure over time.

**Hashing and Immutability**: 
The SHA-256 hashing function proved to be the backbone of blockchain security. Each block's hash depends on all its contents such as transactions, timestamp, previous hash, and nonce. This creates a "fingerprint" that changes completely if even a single character is modified. When I tampered with Alice's transaction amount from 50 to 9999, the hash verification immediately failed because the stored hash no longer matched the recalculated hash from the modified data. This demonstrates how blockchains achieve immutability: any change to historical data is instantly detectable because it breaks the cryptographic chain. The beauty of this system lies in its mathematical certainty - there's no ambiguity about whether data has been altered, making disputes virtually impossible.

**Proof-of-Work Security**: 
The mining process revealed why Proof-of-Work makes blockchains incredibly secure. Finding a hash starting with three zeros required thousands of attempts (3146, 1625, 80 in my tests), representing significant computational work and energy requirement. An attacker wanting to modify a transaction would need to re-mine not just that block, but every subsequent block in the chain, while honest miners continue extending the legitimate chain. This creates an exponentially growing computational barrier that becomes economically unfeasible. The deeper a transaction is buried, the more impossible it becomes to alter, as the required computational power grows exponentially with each additional block.

**Discoveries**:
What surprised me most was the variability in mining times. Block #3 only took 80 attempts while Block #1 required 3146 attempts, despite identical difficulty. This randomness is crucial as it prevents predictable mining patterns and ensures fair distribution of mining rewards across the network. I was also amazed by how the chain validation immediately pinpointed "Invalid hash at block 1" when tampering occurred, demonstrating the precision of cryptographic verification and the system's ability to identify exactly where integrity was compromised.

This project helped me understand why blockchain technology has revolutionized digital trust. It creates mathematical certainty in a previously trust-based system, eliminating the need for central authorities or intermediaries, such as banks, to validate transactions.
