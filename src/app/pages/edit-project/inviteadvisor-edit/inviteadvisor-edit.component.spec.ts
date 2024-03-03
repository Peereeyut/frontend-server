import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteadvisorEditComponent } from './inviteadvisor-edit.component';

describe('InviteadvisorEditComponent', () => {
  let component: InviteadvisorEditComponent;
  let fixture: ComponentFixture<InviteadvisorEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InviteadvisorEditComponent]
    });
    fixture = TestBed.createComponent(InviteadvisorEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
