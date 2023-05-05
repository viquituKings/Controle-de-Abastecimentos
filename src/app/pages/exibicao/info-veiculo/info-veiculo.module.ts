import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InfoVeiculoPageRoutingModule } from './info-veiculo-routing.module';

import { InfoVeiculoPage } from './info-veiculo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InfoVeiculoPageRoutingModule
  ],
  declarations: [InfoVeiculoPage]
})
export class InfoVeiculoPageModule {}
