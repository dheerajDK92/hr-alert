import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { breakPage } from './break.page';

describe('breakPage', () => {
  let component: breakPage;
  let fixture: ComponentFixture<breakPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ breakPage ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(breakPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
