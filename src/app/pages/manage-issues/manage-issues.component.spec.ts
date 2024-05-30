import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageIssuesComponent } from './manage-issues.component';

describe('ManageIssuesComponent', () => {
  let component: ManageIssuesComponent;
  let fixture: ComponentFixture<ManageIssuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageIssuesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
