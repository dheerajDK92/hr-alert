import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { aboutPage } from './about.page';

describe('aboutPage', () => {
  let component: aboutPage;
  let fixture: ComponentFixture<aboutPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ aboutPage ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(aboutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
