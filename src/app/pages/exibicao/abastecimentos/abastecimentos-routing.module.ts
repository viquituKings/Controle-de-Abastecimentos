import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AbastecimentosPage } from './abastecimentos.page';

const routes: Routes = [
  {
    path: '',
    component: AbastecimentosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AbastecimentosPageRoutingModule {}
