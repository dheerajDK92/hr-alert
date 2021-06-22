import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SalarySlipReportPage } from './salary-slip-report.page';

describe('SalarySlipReportPage', () => {
  let component: SalarySlipReportPage;
  let fixture: ComponentFixture<SalarySlipReportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalarySlipReportPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SalarySlipReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
