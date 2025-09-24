import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopNavComponent } from './top-nav.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('TopNavComponent', () => {
  let component: TopNavComponent;
  let fixture: ComponentFixture<TopNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopNavComponent],
      imports: [RouterTestingModule] 
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have nav links', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelectorAll('.nav-links a').length).toBe(4);
  });
});