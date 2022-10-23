import { MenuController, NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-abastecimentos',
  templateUrl: './abastecimentos.page.html',
  styleUrls: ['./abastecimentos.page.scss'],
})
export class AbastecimentosPage implements OnInit {

  constructor(public menuCtrl : MenuController, public navCtrl : NavController) { }

  ngOnInit() {
    this.menuCtrl.enable(true)
  }

  toHome(){
    //metodo para retornar à home em caso de cancelamento
    this.navCtrl.navigateForward("home")
  }
}
