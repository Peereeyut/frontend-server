import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImcsvComponent } from './imcsv.component';

describe('ImcsvComponent', () => {
  let component: ImcsvComponent;
  let fixture: ComponentFixture<ImcsvComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImcsvComponent]
    });
    fixture = TestBed.createComponent(ImcsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
