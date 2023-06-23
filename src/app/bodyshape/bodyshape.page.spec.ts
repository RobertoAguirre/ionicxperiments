import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BodyshapePage } from './bodyshape.page';

describe('BodyshapePage', () => {
  let component: BodyshapePage;
  let fixture: ComponentFixture<BodyshapePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BodyshapePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
