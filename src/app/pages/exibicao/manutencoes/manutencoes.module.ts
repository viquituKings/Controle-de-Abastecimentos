import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManutencoesPageRoutingModule } from './manutencoes-routing.module';

import { ManutencoesPage } from './manutencoes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManutencoesPageRoutingModule
  ],
  declarations: [ManutencoesPage]
})
export class ManutencoesPageModule {}
