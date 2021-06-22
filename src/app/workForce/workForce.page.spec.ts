import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { workForcePage } from "./workForce.page";

describe("workForcePage", () => {
  let component: workForcePage;
  let fixture: ComponentFixture<workForcePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [workForcePage],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(workForcePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
