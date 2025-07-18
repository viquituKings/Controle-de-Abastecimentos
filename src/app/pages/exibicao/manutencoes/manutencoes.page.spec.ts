import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManutencoesPage } from './manutencoes.page';

describe('ManutencoesPage', () => {
  let component: ManutencoesPage;
  let fixture: ComponentFixture<ManutencoesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ManutencoesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
