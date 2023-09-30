import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BlockchainService } from 'src/app/services/blockchain.service';

@Component({
  selector: 'app-pending-transactions',
  templateUrl: './pending-transactions.component.html',
  styleUrls: ['./pending-transactions.component.scss']
})
export class PendingTransactionsComponent {

  public pendingTransactions = [];

  constructor(private blockchainService: BlockchainService, private router: Router){
    this.pendingTransactions = blockchainService.getPendingTransactions();

  }

  minePendingTransaction(){
    this.blockchainService.minePendingTransactions();

    // Navigate to the home page
    this.router.navigate(['/']);
  }

}
