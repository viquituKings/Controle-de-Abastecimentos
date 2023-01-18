import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { getAuth, onAuthStateChanged, updateEmail, updateProfile } from 'firebase/auth';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit {

  constructor(  public alertCtrl : AlertController,
                public loadCtrl : LoadingController,
                public toastCtrl : ToastController,
                public navCtrl : NavController) { }

  auth = getAuth()
  nomeUsuario   : string
  emailUsuario  : string

  async ngOnInit() {
    const loadTela = await this.loadCtrl.create({
      message: 'Buscando informações...'
    })
    loadTela.present()
    onAuthStateChanged(this.auth, user=>{
      if(user){
        this.nomeUsuario = user.displayName
        this.emailUsuario = user.email
      }
      loadTela.dismiss()
    })
  }


  async alertEdit(){
    const toastFail = await this.toastCtrl.create({
      message: 'Erro ao editar.',
      duration: 1500,
      icon: 'close-circle-outline'
    })
    const toastOk = await this.toastCtrl.create({
      message: 'Edição realizada com sucesso!',
      duration: 1500,
      icon: 'checkmark-circle-outline'
    })
    const load = await this.loadCtrl.create({
      message: 'Tentando editar...'
    })

    const alert = await this.alertCtrl.create({
      header: 'Editando seu usuário...',
      inputs:[
        {
          name: 'novoNome',
          placeholder: 'Seu nome:',
          type: 'text',
          attributes: {
            autocomplete: 'name'
          }
        },
      ],
      buttons:[
        {
          text: 'Atualizar!',
          handler: (alertData) => {
            load.present()
            if(alertData.novoNome != "" && alertData.novoEmail != ""){
              updateProfile(this.auth.currentUser, {
                displayName: alertData.novoNome
              }).then(()=>{
                toastOk.present()
                this.toHome()
              }).catch(()=> {
                toastFail.present()
              })
            }else{
              toastFail.present()
            }
            load.dismiss()
          }
      },
      {
        text: 'Cancelar.',
        role: 'cancel'
      }
    ]
    })

    alert.present()
  }
  toHome(){
    this.navCtrl.navigateForward('home')
  }

}