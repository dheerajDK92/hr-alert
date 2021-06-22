import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ScanQrPage } from './scan-qr.page';

describe('ScanQrPage', () => {
  let component: ScanQrPage;
  let fixture: ComponentFixture<ScanQrPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScanQrPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ScanQrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
