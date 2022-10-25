import { NavController } from '@ionic/angular';
import { getAuth, signOut } from 'firebase/auth';
import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Página Inicial', url: 'home', icon: 'home' },
    { title: 'Cadastrar Veículos', url: 'cadastro-veiculos', icon: 'add-circle'},
    { title: 'Cadastrar Abastecimentos', url: 'cadastro-abastecimentos', icon: 'Color-fill'},
    { title: 'Seus Veículos', url: 'exibir-veiculos', icon: 'car'},
    { title: 'Seus Abastecimentos', url: 'exibir-abastecimentos', icon: 'cloud'},
  ];
  constructor(public navCtrl : NavController) {}

  auth = getAuth()

  logout(){
    signOut(this.auth).then((sucesso) => {
      console.log("logout com sucesso")
      this.toLogin()
    }).catch((erro) => {
      console.log("falha no logout")
    })
  }

  toLogin(){
    this.navCtrl.navigateForward("login")
  }
}
