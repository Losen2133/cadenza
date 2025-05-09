import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyMusicPage } from './my-music.page';

describe('MyMusicPage', () => {
  let component: MyMusicPage;
  let fixture: ComponentFixture<MyMusicPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyMusicPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
