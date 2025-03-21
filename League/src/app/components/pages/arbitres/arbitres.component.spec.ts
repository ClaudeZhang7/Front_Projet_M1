import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArbitresComponent } from './arbitres.component';

describe('ArbitresComponent', () => {
  let component: ArbitresComponent;
  let fixture: ComponentFixture<ArbitresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArbitresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArbitresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
