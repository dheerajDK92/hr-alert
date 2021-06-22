import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DownloadSiteQRCodePage } from './download-site-qrcode.page';

describe('DownloadSiteQRCodePage', () => {
  let component: DownloadSiteQRCodePage;
  let fixture: ComponentFixture<DownloadSiteQRCodePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadSiteQRCodePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DownloadSiteQRCodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
