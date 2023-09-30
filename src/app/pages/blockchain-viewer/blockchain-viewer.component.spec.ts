import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockchainViewerComponent } from './blockchain-viewer.component';

describe('BlockchainViewerComponent', () => {
  let component: BlockchainViewerComponent;
  let fixture: ComponentFixture<BlockchainViewerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlockchainViewerComponent]
    });
    fixture = TestBed.createComponent(BlockchainViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
