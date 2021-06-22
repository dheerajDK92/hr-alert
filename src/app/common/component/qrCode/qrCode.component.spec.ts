import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { qrComponent } from "./qrCode.component";

describe("qrComponent", () => {
  let component: qrComponent;
  let fixture: ComponentFixture<qrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [qrComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(qrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
