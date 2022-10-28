import { createUserWithEmailAndPassword, getAuth, updateCurrentUser, updateProfile } from 'firebase/auth';
import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit {

  constructor(public menuCtrl : MenuController, public navCtrl : NavController) { }

  auth = getAuth()
  inpNomeCadastro : string = ""
  inpEmailCadastro : string = ""
  inpSenhaCadastro : string = ""
  inpConfSenhaCadastro : string = ""

  ngOnInit() {
    this.menuCtrl.enable(false)
  }

  cadastrar(){
    createUserWithEmailAndPassword(this.auth, this.inpEmailCadastro, this.inpSenhaCadastro)
      .then((usuario) => {
        this.atualizaNome()
        console.log("usuario cadastrado")
        this.toLogin()
      }).catch((erro) => {
        console.log("erro ao cadastrar usuario")
      })
  }

  atualizaNome(){
    updateProfile(this.auth.currentUser, {
      displayName: this.inpNomeCadastro
    }).then(() => console.log("nome atualizado"))
      .catch(() => console.log("erro ao atualizar nome"))
  }

  toLogin(){
    this.navCtrl.navigateForward("login")
  }
  

}
