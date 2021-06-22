import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { teamPage } from './team.page';

describe('teamPage', () => {
  let component: teamPage;
  let fixture: ComponentFixture<teamPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ teamPage ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(teamPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
