import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { advancePage } from './advance.page';

describe('advancePage', () => {
  let component: advancePage;
  let fixture: ComponentFixture<advancePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ advancePage ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(advancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
