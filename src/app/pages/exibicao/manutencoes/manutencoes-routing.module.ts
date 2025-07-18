import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManutencoesPage } from './manutencoes.page';

const routes: Routes = [
  {
    path: '',
    component: ManutencoesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManutencoesPageRoutingModule {}
