// blockchain.js
// Extended Mini blockchain with enhanced Proof-of-Work, transactions, and validation.
// Run: node blockchain.js

const crypto = require('crypto');

/** Transaction class to represent individual transactions */
class Transaction {
    constructor(from, to, amount) {
        this.from = from;
        this.to = to;
        this.amount = amount;
        this.timestamp = Date.now();
    }
}

/** A single block in the chain */
class Block {
    /**
     * @param {number} index
     * @param {string} timestamp - e.g., Date.now().toString()
     * @param {Transaction[]} transactions - array of transaction objects
     * @param {string} previousHash - hex string of prev block hash
     */
    constructor(index, timestamp, transactions, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.transactions = transactions; // Changed from 'data' to 'transactions'
        this.previousHash = previousHash;
        this.nonce = 0; // used for mining
        this.hash = this.calculateHash();
    }

    /** Compute SHA-256 over the block's contents */
    calculateHash() {
        return crypto
            .createHash('sha256')
            .update(
                String(this.index) +
                this.timestamp +
                JSON.stringify(this.transactions) + // Updated to use transactions
                this.previousHash +
                String(this.nonce)
            )
            .digest('hex');
    }

    /** Proof-of-Work: find a hash starting with N leading zeros */
    mineBlock(difficulty) {
        const target = '0'.repeat(difficulty);
        let attempts = 0; // Track number of attempts

        console.log(`Mining block #${this.index} ...`);

        while (this.hash.substring(0, difficulty) !== target) {
            this.nonce++;
            attempts++;
            this.hash = this.calculateHash();
        }

        console.log(`Block mined: ${this.hash}`);
        console.log(`Mining took ${attempts} attempts (nonce: ${this.nonce})`);
    }
}

/** A simple blockchain container */
class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 3; // Set minimum difficulty to 3
    }

    createGenesisBlock() {
        // Genesis block with a special transaction
        const genesisTransaction = new Transaction(null, "Genesis", 0);
        return new Block(0, Date.now().toString(), [genesisTransaction], '0');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    /**
     * Add a new block to the chain.
     * Sets its previousHash, mines it, then appends.
     */
    addBlock(transactions) {
        const latestBlock = this.getLatestBlock();
        const newIndex = latestBlock.index + 1;
        const newBlock = new Block(newIndex, Date.now().toString(), transactions, latestBlock.hash);
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    /** Verify integrity: hash consistency + correct previousHash links */
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const current = this.chain[i];
            const previous = this.chain[i - 1];

            // recompute hash from the block's current contents
            if (current.hash !== current.calculateHash()) {
                console.log(`Invalid hash at block ${i}`);
                return false;
            }

            // ensure link matches previous block's actual hash
            if (current.previousHash !== previous.hash) {
                console.log(`Invalid previous hash at block ${i}`);
                return false;
            }
        }
        return true;
    }
}

/* ---------------------- DEMO / WALKTHROUGH ---------------------- */
function main() {
    console.log("=== BLOCKCHAIN DEMONSTRATION ===\n");

    // 1) Create a chain
    const demoCoin = new Blockchain(); // difficulty=3 is set in constructor

    // 2) Add blocks with transaction objects (need at least 5 transactions total)
    console.log('Adding Block #1 with 2 transactions...');
    demoCoin.addBlock([
        new Transaction('Alice', 'Bob', 50),
        new Transaction('Bob', 'Charlie', 25)
    ]);

    console.log('\nAdding Block #2 with 2 transactions...');
    demoCoin.addBlock([
        new Transaction('Charlie', 'David', 30),
        new Transaction('David', 'Eve', 15)
    ]);

    console.log('\nAdding Block #3 with 1 transaction...');
    demoCoin.addBlock([
        new Transaction('Eve', 'Alice', 10)
    ]);

    // 3) Validate untampered chain
    console.log('\n=== VALIDATION TEST ===');
    console.log('Is chain valid?', demoCoin.isChainValid());

    // 4) Tamper test: modify transaction in block #1 and re-validate
    console.log('\nTampering with block #1 data...');
    demoCoin.chain[1].transactions[0].amount = 9999; // Change Alice->Bob from 50 to 9999
    console.log('Is chain valid after tamper?', demoCoin.isChainValid());

    // 5) Show transaction summary
    console.log('\n=== TRANSACTION SUMMARY ===');
    let totalTransactions = 0;
    demoCoin.chain.forEach((block, index) => {
        console.log(`Block #${index}: ${block.transactions.length} transaction(s)`);
        block.transactions.forEach(tx => {
            if (tx.from && tx.to !== "Genesis") {
                console.log(`  ${tx.from} -> ${tx.to}: ${tx.amount}`);
                totalTransactions++;
            }
        });
    });
    console.log(`\nTotal transactions: ${totalTransactions}`);

    // 6) Show blockchain structure (optional - comment out if too verbose)
    // console.log('\n=== FULL BLOCKCHAIN ===');
    // console.log(JSON.stringify(demoCoin, null, 2));
}

main();