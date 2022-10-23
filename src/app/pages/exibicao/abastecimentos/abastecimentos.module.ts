import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AbastecimentosPageRoutingModule } from './abastecimentos-routing.module';

import { AbastecimentosPage } from './abastecimentos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AbastecimentosPageRoutingModule
  ],
  declarations: [AbastecimentosPage]
})
export class AbastecimentosPageModule {}
