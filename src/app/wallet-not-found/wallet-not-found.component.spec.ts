import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletNotFoundComponent } from './wallet-not-found.component';

describe('WalletNotFoundComponent', () => {
  let component: WalletNotFoundComponent;
  let fixture: ComponentFixture<WalletNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletNotFoundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
