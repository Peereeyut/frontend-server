import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotfoundpathComponent } from './notfoundpath.component';

describe('NotfoundpathComponent', () => {
  let component: NotfoundpathComponent;
  let fixture: ComponentFixture<NotfoundpathComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotfoundpathComponent]
    });
    fixture = TestBed.createComponent(NotfoundpathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
