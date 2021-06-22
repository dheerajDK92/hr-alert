import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { reportsPage } from './reports.page';

describe('reportsPage', () => {
  let component: reportsPage;
  let fixture: ComponentFixture<reportsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ reportsPage ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(reportsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
