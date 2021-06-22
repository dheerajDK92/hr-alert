import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { PendingTaskComponent } from "./pending-task.component";

describe("PendingTaskComponent", () => {
  let component: PendingTaskComponent;
  let fixture: ComponentFixture<PendingTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PendingTaskComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(PendingTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
