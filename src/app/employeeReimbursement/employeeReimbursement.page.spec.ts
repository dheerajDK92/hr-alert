import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { employeeReimbursementPage } from "./employeeReimbursement.page";

describe("employeeReimbursementPage", () => {
  let component: employeeReimbursementPage;
  let fixture: ComponentFixture<employeeReimbursementPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [employeeReimbursementPage],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(employeeReimbursementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
