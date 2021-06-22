import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { monthlyPage } from './monthly.page';

describe('monthlyPage', () => {
  let component: monthlyPage;
  let fixture: ComponentFixture<monthlyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ monthlyPage ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(monthlyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
