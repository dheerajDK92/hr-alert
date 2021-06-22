import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { employeeDashboardPage } from './employeeDashboard.page';

describe('employeeDashboardPage', () => {
  let component: employeeDashboardPage;
  let fixture: ComponentFixture<employeeDashboardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ employeeDashboardPage ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(employeeDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
