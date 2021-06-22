import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { employeeLeavePage } from "./employeeLeave.page";

describe("employeeLeavePage", () => {
  let component: employeeLeavePage;
  let fixture: ComponentFixture<employeeLeavePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [employeeLeavePage],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(employeeLeavePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
