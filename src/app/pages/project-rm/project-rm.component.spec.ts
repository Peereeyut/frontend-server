import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectRMComponent } from './project-rm.component';

describe('ProjectRMComponent', () => {
  let component: ProjectRMComponent;
  let fixture: ComponentFixture<ProjectRMComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectRMComponent]
    });
    fixture = TestBed.createComponent(ProjectRMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
