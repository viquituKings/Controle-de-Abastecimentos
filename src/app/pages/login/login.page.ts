import { Component, OnInit } from '@angular/core';
import { MenuController, NavController, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { getAuth, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth'


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor( public menuCtrl : MenuController, 
    public navCtrl   : NavController, 
    public toastCtrl : ToastController,
    public alertCtrl : AlertController,
    public loadCtrl  : LoadingController) { }

  auth = getAuth()
  inpEmailLogin : string = ""
  inpSenhaLogin : string = ""
  inpRecSenha   : string = ""

  
  async ngOnInit() {
    const load = await this.loadCtrl.create({
      message : 'Tentando fazer login...'
    })
    load.present()
    this.menuCtrl.enable(false)
    onAuthStateChanged(this.auth, (user) => {
      if(user){
        load.dismiss()
        this.toastLogOk()
        this.toHome()
      } else {
        load.dismiss()
        this.toastFalhaLogAuto()
      }
    })
  }

  toCadastro(){
    this.navCtrl.navigateForward("cadastro-usuario")
  }
  

  async logar(){
    const load = await this.loadCtrl.create({
      message : 'Tentando fazer login...'
    })
    if(this.inpEmailLogin == "" || this.inpSenhaLogin == "" ){
      this.alertCamposVazios()
    }else{
      load.present()
      signInWithEmailAndPassword(this.auth, this.inpEmailLogin, this.inpSenhaLogin)
      .then((usuario) => {
        load.dismiss()
        this.toastLogOk()
        this.toHome()
      })
      .catch((erro) => {
        load.dismiss()
        console.log(erro)
        this.alertUsuarioOuSenhaIncorretos()
      })
    }
  }

  async alertRecuperarSenha(){
    const load = await this.loadCtrl.create({
      message : 'Tentando enviar email...'
    })
    const alert = await this.alertCtrl.create({
      header: 'Recuperação de senha',
      subHeader: 'Insira um email para enviar o link para recuperar sua senha',
      inputs: [{
        placeholder: 'Email: ',
        type: 'email',
        name: 'inpRecSenha'
      }],
      buttons: [{
        text: 'Enviar',
        handler: (alertData)=>{
          load.present()
          sendPasswordResetEmail(this.auth, alertData.inpRecSenha)
          .then(sucesso => {
            load.dismiss()
            this.toastRecSenhaOk()
          }).catch(erro => {
            load.dismiss()
            this.toastRecSenhaFalha()
          })
        }
      }]
    })
    await alert.present()
  }

  async alertCamposVazios(){
    const alert = await this.alertCtrl.create({
      header: 'Ops...',
      subHeader: 'Favor, preencha todos os campos antes de continuar.',
      buttons:['Ok']
    })
    await alert.present()
  }

  async alertUsuarioOuSenhaIncorretos(){
    const alert = await this.alertCtrl.create({
      header: 'Ops...',
      subHeader: 'Verifique se o usuário e senha informados são válidos ou se ja foram previamente cadastrados no aplicativo',
      buttons: ['Ok']
    })
    await alert.present()
  }

  async toastLogOk(){
    const toast = await this.toastCtrl.create({
      message : `usuário ${this.inpEmailLogin} logado!`,
      icon : 'checkmark-circle-outline',
      duration : 1500
    })
    toast.present()
  }

  async toastFalhaLogAuto(){
    const toast = await this.toastCtrl.create({
      message : 'Não foi possível logar automaticamente',
      icon : 'close-circle-outline',
      duration : 1500
    })
    toast.present()
  }

  async toastRecSenhaOk(){
    const toast = await this.toastCtrl.create({
      message: 'Email de recuperação enviado!',
      duration: 1500,
      icon: 'checkmark-circle-outline',
    })
    await toast.present()
  }

  async toastRecSenhaFalha(){
    const toast = await this.toastCtrl.create({
      message : 'Não foi possível enviar o email',
      duration : 1500,
      icon : 'close-circle-outline'
    })
    await toast.present()
  }

  toHome(){
    this.navCtrl.navigateForward("home")
  }
}
