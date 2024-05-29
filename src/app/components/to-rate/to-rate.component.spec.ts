import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToRateComponent } from './to-rate.component';

describe('ToRateComponent', () => {
  let component: ToRateComponent;
  let fixture: ComponentFixture<ToRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToRateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ToRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
