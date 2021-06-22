import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { JobPendingComponent } from "./job-pending.component";

describe("JobPendingComponent", () => {
  let component: JobPendingComponent;
  let fixture: ComponentFixture<JobPendingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [JobPendingComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(JobPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
