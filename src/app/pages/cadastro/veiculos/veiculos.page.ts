import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-veiculos',
  templateUrl: './veiculos.page.html',
  styleUrls: ['./veiculos.page.scss'],
})
export class VeiculosPage implements OnInit {

  constructor(public menuCtrl : MenuController, public navCtrl : NavController) { }

  inpPlaca1 : string = ""
  inpPlaca2 : string = ""
  radioTipoVeiculo : string = ""
  selectMarca : string = ""
  selectModelo : string = ""
  inpAnoVeiculo : number = 0
  inpKmAtual : number = 0

  ngOnInit() {
    this.menuCtrl.enable(true)
  }

  toHome(){
    //metodo para retornar à home em caso de cancelamento do cadastro
    this.navCtrl.navigateForward("home")
  }

  cadastrar(){

  }
}
