import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeywordAdComponent } from './keyword-ad.component';

describe('KeywordAdComponent', () => {
  let component: KeywordAdComponent;
  let fixture: ComponentFixture<KeywordAdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KeywordAdComponent]
    });
    fixture = TestBed.createComponent(KeywordAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
