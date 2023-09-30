import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/app/services/blockchain';
import { BlockchainService } from 'src/app/services/blockchain.service';

@Component({
  selector: 'app-create-transaction',
  templateUrl: './create-transaction.component.html',
  styleUrls: ['./create-transaction.component.scss']
})
export class CreateTransactionComponent {

  public newTx = new Transaction(null, null, null, null);
  public walletKey;

  constructor(private blockchainService: BlockchainService){
    this.walletKey = blockchainService.walletKeys[0];
  }



  createTransaction(){
    this.newTx.fromAddress = this.walletKey.publicKey;
    this.newTx.timestamp = Date.now();
    this.newTx.signTransaction(this.walletKey.keyObj);

    this.blockchainService.addTransaction(this.newTx);

    this.newTx = new Transaction(null, null, null, null);
  }

}
