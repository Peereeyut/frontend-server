import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectAdComponent } from './project-ad.component';

describe('ProjectAdComponent', () => {
  let component: ProjectAdComponent;
  let fixture: ComponentFixture<ProjectAdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectAdComponent]
    });
    fixture = TestBed.createComponent(ProjectAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
