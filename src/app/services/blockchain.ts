const SHA256 = require('crypto-js/sha256')
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

export class Transaction{
	fromAddress: any;
	toAddress: any;
	amount: any;
	signature: any;
	timestamp: any;
	constructor(fromAddress, toAddress, amount, timestamp){
		this.fromAddress = fromAddress;
		this.toAddress = toAddress;
		this.amount = amount;
		this.timestamp = timestamp;
	}

	calculateHash(){
		return SHA256(this.fromAddress + this.toAddress + this.amount + this.timestamp).toString();
	}

	signTransaction(signingKey){
		if(signingKey.getPublic('hex') !== this.fromAddress){
			throw Error('You cannot sign transations for other wallets');
		}


		const hashTx = this.calculateHash();
		//?
		const sig = signingKey.sign(hashTx, 'base64');
		//?
		this.signature = sig.toDER('hex');
	}

	//check whehther the transaction is valid
	isValid(){
		if(this.fromAddress === null){
			return true;
		}

		if(!this.signature || this.signature.length === 0){
			throw Error('No signature in this transaction');
		}

		const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
		return publicKey.verify(this.calculateHash(), this.signature);
	}
}

export class Block{
	timestamp: any;
	transactions: any;
	previousHash: string;
	hash: any;
	nonce: number;
	constructor(timestamp, transactions, previousHash = ''){

		this.timestamp = timestamp;
		this.transactions = transactions;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
		this.nonce = 0;
	}

	calculateHash() {
		return SHA256(this.timestamp + JSON.stringify(this.transactions) + this.previousHash + this.nonce).toString();
	}

	mineBlock(difficulty){
		while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
			this.nonce++;
			this.hash = this.calculateHash();
		}

		console.log("nunce: " + this.nonce);
		console.log("Block mined: " + this.hash);
	}

	hasValidTransactions(){
		for(const tx of this.transactions){
			if(!tx.isValid()){
				return false;
			}
		}
		return true;
	}
}

export class Blockchain{
	chain: Block[];
	difficulty: number;
	pendingTransactions: any[];
	miningReward: number;
	constructor() {
		this.chain = [this.createGenesisBlock()];
		this.difficulty = 2;
		this.pendingTransactions = [];
		this.miningReward = 100;
	}

	createGenesisBlock() {
		/*original code: return new Block(new Date(2023,9,20).getTime(), "Genesis Block", "0");
		But in transaction-table component, I need to verfify whether the transaction.length ===0
		so here should be []*/
		return new Block(new Date(2023,8,20).getTime(), [], "0");
	}

	getLatestBlock(){
		return this.chain[this.chain.length - 1];
	}

	minePendingTransactions(miningRewardAddress){
		//the coin reward transaction
		let coinBaseTransaction = new Transaction(null, miningRewardAddress, this.miningReward, Date.now());

		//add the coin reward transaction to the transaction list
		this.pendingTransactions.unshift(coinBaseTransaction);

		let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
		block.mineBlock(this.difficulty);

		console.log('Block successfully mined!');
		this.chain.push(block);

		this.pendingTransactions = [
			//new Transaction(null, miningRewardAddress, this.miningReward)
		];
	}
/*
	createTransaction(transaction){
		this.pendingTransactions.push(transaction);
	}
*/

	addTransaction(transaction){
		
		if(!transaction.fromAddress || !transaction.toAddress){
			throw Error('Transaction must contain from and to address');
		}

		if(!transaction.isValid()){
			throw Error('Cannot add invalid transaction to chain');
		}

		this.pendingTransactions.push(transaction);
	}


	getBalanceOfAddress(address){
		let balance = 0;

		for(const block of this.chain){
			for(const trans of block.transactions){
				if(trans.fromAddress === address){
					balance -= trans.amount;
				}

				if(trans.toAddress === address){
					balance += trans.amount;
				}
			}
		}

		return balance;
	}

	isChainValid(){
		for(let i = 1; i < this.chain.length; i++){
			const currentBlock = this.chain[i];
			const previousBlock = this.chain[i-1];

			if(!currentBlock.hasValidTransactions()){
				return false;
			}

			//to validate that the data have not been changed
			if(currentBlock.hash !== currentBlock.calculateHash()){
				return false;
			}

			//to validate that the block is linked right
			if(currentBlock.previousHash !== previousBlock.hash){
				return false;
			}
		}

		return true
	}

}
