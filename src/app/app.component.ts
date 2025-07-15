import { MenuController, NavController } from '@ionic/angular';
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
    { title: 'Cadastrar Veículos', url: 'cadastro-veiculos', icon: 'add-circle' },
    { title: 'Meus Veículos', url: 'exibir-veiculos', icon: 'car' },
    { title: 'Cadastrar Abastecimentos', url: 'cadastro-abastecimentos', icon: 'Color-fill' },
    { title: 'Meus Abastecimentos', url: 'exibir-abastecimentos', icon: 'cloud' },
    { title: 'Cadastrar Manutenções', url: 'cadastro-manutencoes', icon: 'build' },
    
  ];
  constructor(public navCtrl: NavController,
    public menuCtrl: MenuController) { }

  auth = getAuth()

  logout() {
    signOut(this.auth).then((sucesso) => {
      console.log("logout com sucesso")
      this.toLogin()
    }).catch((erro) => {
      console.log("falha no logout")
    })
  }

  toLogin() {
    this.navCtrl.navigateForward("login")
    this.menuCtrl.close()
    this.menuCtrl.enable(false)
  }

  toExibeUsuario() {
    this.navCtrl.navigateForward("exibir-usuario");
    this.menuCtrl.close()

  }

  comentario() {
    window.location.href = "mailto:sac.reissoftware@gmail.com?subject=Comentários%20sobre%20o%20app%20Controle%20de%20Abastecimentos"
  }
}
