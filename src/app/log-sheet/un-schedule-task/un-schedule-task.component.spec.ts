import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { UnScheduleTaskComponent } from "./un-schedule-task.component";

describe("UnScheduleTaskComponent", () => {
  let component: UnScheduleTaskComponent;
  let fixture: ComponentFixture<UnScheduleTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UnScheduleTaskComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(UnScheduleTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
