import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit {

  constructor(public menuCtrl : MenuController, public navCtrl : NavController) { }

  ngOnInit() {
    this.menuCtrl.enable(false)
  }
  

}
