import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { menuPage } from './menu.page';

describe('teamPmenuPageage', () => {
  let component: menuPage;
  let fixture: ComponentFixture<menuPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ menuPage ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(menuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
