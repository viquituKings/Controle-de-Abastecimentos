import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(public menuCtrl : MenuController, public navCtrl : NavController) { }

  ngOnInit() {
    this.menuCtrl.enable(true)
  }

}
