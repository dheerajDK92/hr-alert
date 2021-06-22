import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { employeeLeaveSummaryPage } from "./employeeLeaveSummary.page";

describe("employeeLeaveSummaryPage", () => {
  let component: employeeLeaveSummaryPage;
  let fixture: ComponentFixture<employeeLeaveSummaryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [employeeLeaveSummaryPage],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(employeeLeaveSummaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
