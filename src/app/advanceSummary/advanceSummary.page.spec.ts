import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { advanceSummaryPage } from './advanceSummary.page';

describe('advanceSummaryPage', () => {
  let component: advanceSummaryPage;
  let fixture: ComponentFixture<advanceSummaryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ advanceSummaryPage ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(advanceSummaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
