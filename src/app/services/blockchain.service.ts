import { Injectable } from '@angular/core';
import { Blockchain } from 'src/app/services/blockchain';
import { ec as EC } from "elliptic";

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {

  public blockchainInstance = new Blockchain();
  public walletKeys = [];

  constructor() { 
    this.blockchainInstance.difficulty = 2;
    this.blockchainInstance.minePendingTransactions('my-wallet-address');

    this.generateWalletKeys();

  }

  getBlocks(){
    return this.blockchainInstance.chain;
  }

  addTransaction(tx){
    this.blockchainInstance.addTransaction(tx);
  }  

  getPendingTransactions(){
    return this.blockchainInstance.pendingTransactions;
  }

  minePendingTransactions(){
    this.blockchainInstance.minePendingTransactions(
      this.walletKeys[0].publicKey
    )
  }

  private generateWalletKeys(){
    const ec = new EC('secp256k1');
    const key = ec.genKeyPair();

    this.walletKeys.push({
      keyObj: key,
      publicKey: key.getPublic('hex'),
      privateKey: key.getPrivate('hex'),
    });
  }
}
