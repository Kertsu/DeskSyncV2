import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformComponent } from './inform.component';

describe('InformComponent', () => {
  let component: InformComponent;
  let fixture: ComponentFixture<InformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InformComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
