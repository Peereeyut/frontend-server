import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenubarHeaderComponent } from './menubar-header.component';

describe('MenubarHeaderComponent', () => {
  let component: MenubarHeaderComponent;
  let fixture: ComponentFixture<MenubarHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenubarHeaderComponent]
    });
    fixture = TestBed.createComponent(MenubarHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
