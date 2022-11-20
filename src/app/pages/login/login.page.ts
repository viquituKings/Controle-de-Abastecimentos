import { Component, OnInit } from '@angular/core';
import { MenuController, NavController, ToastController, AlertController } from '@ionic/angular';
import { getAuth, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth'


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor( public menuCtrl : MenuController, 
    public navCtrl : NavController, 
    public toastCtrl : ToastController,
    public alertCtrl : AlertController) { }

  auth = getAuth()
  inpEmailLogin : string = ""
  inpSenhaLogin : string = ""
  inpRecSenha   : string = ""

  
  ngOnInit() {
    this.menuCtrl.enable(false)
    onAuthStateChanged(this.auth, (user) => {
      if(user){
        this.navCtrl.navigateForward("home")
      }
    })
  }

  toCadastro(){
    this.navCtrl.navigateForward("cadastro-usuario")
  }
  //efetuar login
  logar(){
    if(this.inpEmailLogin == "" || this.inpSenhaLogin == "" ){
      this.alertCamposVazios()
    }else{
      signInWithEmailAndPassword(this.auth, this.inpEmailLogin, this.inpSenhaLogin)
      .then((usuario) => {
        this.toHome();
      })
      .catch((erro) => {
        console.log(erro)
        this.alertUsuarioOuSenhaIncorretos()
      })
    }
  }

  async alertRecuperarSenha(){
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
          sendPasswordResetEmail(this.auth, alertData.inpRecSenha)
          .then(sucesso => {
            this.toastRecSenhaOk()
          }).catch(erro => {
            
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

  async toastRecSenhaOk(){
    const toast = await this.toastCtrl.create({
      message: 'Email de recuperação enviado!',
      duration: 1500,
      icon: 'checkmark-circle-outline',
    })
    await toast.present()
  }

  toHome(){
    this.navCtrl.navigateForward("home")
  }
}
