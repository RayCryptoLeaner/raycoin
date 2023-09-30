import { Component, Input } from '@angular/core';
import { BlockchainService } from 'src/app/services/blockchain.service';

@Component({
  selector: 'app-block-view',
  templateUrl: './block-view.component.html',
  styleUrls: ['./block-view.component.scss']
})
export class BlockViewComponent {
  @Input() public block: any;

  @Input() public selectedBlock;

  private blocksInChain

  constructor(private blockchainService: BlockchainService){
    this.blocksInChain = blockchainService.blockchainInstance.chain;
   }
  
}
