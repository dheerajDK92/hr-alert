import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { SalarySlipPage } from "./salary-slip.page";

describe("SalarySlipPage", () => {
  let component: SalarySlipPage;
  let fixture: ComponentFixture<SalarySlipPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SalarySlipPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(SalarySlipPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
