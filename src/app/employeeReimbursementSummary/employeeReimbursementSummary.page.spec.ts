import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { employeeReimbursementSummaryPage } from "./employeeReimbursementSummary.page";

describe("employeeReimbursementSummaryPage", () => {
  let component: employeeReimbursementSummaryPage;
  let fixture: ComponentFixture<employeeReimbursementSummaryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [employeeReimbursementSummaryPage],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(employeeReimbursementSummaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
