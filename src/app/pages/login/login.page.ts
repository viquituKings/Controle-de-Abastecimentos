import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor( public menuCtrl : MenuController, public navCtrl : NavController) { }

  auth = getAuth()
  inpEmailLogin : string = ""
  inpSenhaLogin : string = ""

  
  ngOnInit() {
    this.menuCtrl.enable(false)
    onAuthStateChanged(this.auth, (user) => {
      if(user){
        console.log(`usuario ${user.email} logado`)
        this.navCtrl.navigateForward("home")
      }
    })
  }

  toCadastro(){
    this.navCtrl.navigateForward("cadastro-usuario")
  }
  //função para efetuar login
  logar(){
    signInWithEmailAndPassword(this.auth, this.inpEmailLogin, this.inpSenhaLogin)
      .then((usuario) => {
        console.log("logado")
        this.toHome();
      })
      .catch((erro) => {
        console.log("Erro")
      })
  }

  toHome(){
    this.navCtrl.navigateForward("home")
  }
}
