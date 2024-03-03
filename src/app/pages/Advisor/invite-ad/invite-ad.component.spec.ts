import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteAdComponent } from './invite-ad.component';

describe('InviteAdComponent', () => {
  let component: InviteAdComponent;
  let fixture: ComponentFixture<InviteAdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InviteAdComponent]
    });
    fixture = TestBed.createComponent(InviteAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
