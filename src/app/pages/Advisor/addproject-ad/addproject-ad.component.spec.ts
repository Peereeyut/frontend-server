import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddprojectAdComponent } from './addproject-ad.component';

describe('AddprojectAdComponent', () => {
  let component: AddprojectAdComponent;
  let fixture: ComponentFixture<AddprojectAdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddprojectAdComponent]
    });
    fixture = TestBed.createComponent(AddprojectAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
