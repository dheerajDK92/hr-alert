import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LogSheetPage } from './log-sheet.page';

describe('LogSheetPage', () => {
  let component: LogSheetPage;
  let fixture: ComponentFixture<LogSheetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogSheetPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LogSheetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
