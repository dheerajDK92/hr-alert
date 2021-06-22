import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GenerateSalarySlipPage } from './generate-salary-slip.page';

describe('GenerateSalarySlipPage', () => {
  let component: GenerateSalarySlipPage;
  let fixture: ComponentFixture<GenerateSalarySlipPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateSalarySlipPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GenerateSalarySlipPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
