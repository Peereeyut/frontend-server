import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateprofileAdComponent } from './updateprofile-ad.component';

describe('UpdateprofileAdComponent', () => {
  let component: UpdateprofileAdComponent;
  let fixture: ComponentFixture<UpdateprofileAdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateprofileAdComponent]
    });
    fixture = TestBed.createComponent(UpdateprofileAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
