import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StartAppComponent } from './start-app.component';

describe('StartAppComponent', () => {
  let component: StartAppComponent;
  let fixture: ComponentFixture<StartAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StartAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
