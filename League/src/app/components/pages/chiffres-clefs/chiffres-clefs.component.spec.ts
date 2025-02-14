import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiffresClefsComponent } from './chiffres-clefs.component';

describe('ChiffresClefsComponent', () => {
  let component: ChiffresClefsComponent;
  let fixture: ComponentFixture<ChiffresClefsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChiffresClefsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChiffresClefsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
