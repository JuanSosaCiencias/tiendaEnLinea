import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductImageUserComponent } from './product-image-user.component';

describe('ProductImageUserComponent', () => {
  let component: ProductImageUserComponent;
  let fixture: ComponentFixture<ProductImageUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductImageUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductImageUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
