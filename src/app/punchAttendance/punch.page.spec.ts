import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { punchPage } from './punch.page';

describe('mainPage', () => {
  let component: punchPage;
  let fixture: ComponentFixture<punchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ punchPage ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(punchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
