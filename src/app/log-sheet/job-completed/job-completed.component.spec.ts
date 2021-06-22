import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { JobCompletedComponent } from "./job-completed.component";

describe("JobCompletedComponent", () => {
  let component: JobCompletedComponent;
  let fixture: ComponentFixture<JobCompletedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [JobCompletedComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(JobCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
