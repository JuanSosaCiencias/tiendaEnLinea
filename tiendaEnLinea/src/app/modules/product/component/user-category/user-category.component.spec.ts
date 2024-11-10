import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCategoryComponent } from './user-category.component';

describe('UserCategoryComponent', () => {
  let component: UserCategoryComponent;
  let fixture: ComponentFixture<UserCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
