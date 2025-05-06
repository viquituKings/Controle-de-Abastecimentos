import { createUserWithEmailAndPassword, getAuth, updateCurrentUser, updateProfile } from 'firebase/auth';
import { Component, OnInit } from '@angular/core';
import { MenuController, NavController, AlertController, ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit {

  constructor(public menuCtrl: MenuController,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public loadCtrl: LoadingController) { }

  auth = getAuth()
  inpNomeCadastro: string = ""
  inpEmailCadastro: string = ""
  inpSenhaCadastro: string = ""
  inpConfSenhaCadastro: string = ""

  ngOnInit() {
    this.menuCtrl.enable(false)
    this.alertLGPD()
  }

  async alertLGPD() {
    const alert = await this.alertCtrl.create({
      header: "Aviso sobre uso de dados!",
      subHeader: "Dados necessários para cadastro e suas finalidades:",
      message: "Email: Acesso ao aplicativo e identificação de dados de veículos no Banco de dados; " + "Nome: Identificação do usuário no banco de dados. " + " Aceite este termo para continuar a utilizar a aplicação.",
      buttons: [
        {
          text: "Aceito!",
          role: 'cancel'
        },
        {
          text: "Recuso!",
          handler: () => {
            this.toLogin()
          }
        }
      ]
    })
    alert.present()
  }

  async cadastrar() {
    const load = await this.loadCtrl.create({
      message: 'Tentando cadastrar usuário...'
    })
    if (this.inpEmailCadastro == "" || this.inpSenhaCadastro == "" || this.inpConfSenhaCadastro == "" || this.inpNomeCadastro == "") {
      this.alertCamposVazios();
    } else if (this.inpSenhaCadastro == this.inpConfSenhaCadastro) {
      load.present()
      createUserWithEmailAndPassword(this.auth, this.inpEmailCadastro, this.inpSenhaCadastro)
        .then((usuario) => {
          load.dismiss()
          this.atualizaNome()
          this.toastCadastroOk()
          this.toLogin()
        }).catch((erro) => {
          load.dismiss()
          this.alertImpossivelCadastrar()
        })
    } else {
      load.dismiss()
      this.alertSenhasDivergentes()
    }

  }

  async alertCamposVazios() {
    const alert = await this.alertCtrl.create({
      header: 'Ops...',
      subHeader: 'Favor, preencha todos os campos antes de continuar.',
      buttons: ['Ok']
    })
    await alert.present()
  }

  async alertSenhasDivergentes() {
    const alert = await this.alertCtrl.create({
      header: 'Ops...',
      subHeader: 'Favor, verificar se as senhas correspondem uma com a outra',
      buttons: ['Ok']
    })
    await alert.present()
  }

  async alertImpossivelCadastrar() {
    const alert = await this.alertCtrl.create({
      header: 'Ops...',
      subHeader: 'Ocorreu algum erro durante seu cadastro, verifique se seu email esta correto ou se sua conta ja não foi cadastrada',
      buttons: ['Ok']
    })
    await alert.present()
  }

  async toastCadastroOk() {
    const toast = await this.toastCtrl.create({
      message: 'Cadastro realizado com sucesso!',
      icon: 'checkmark-circle-outline',
      duration: 1500
    })
    await toast.present()
  }

  async atualizaNome() {
    const load = await this.loadCtrl.create({
      message: 'Atualizando dados...'
    })
    load.present()
    updateProfile(this.auth.currentUser, {
      displayName: this.inpNomeCadastro
    }).then(() => console.log("nome atualizado"))
      .catch(() => console.log("erro ao atualizar nome"))
    load.dismiss()
  }

  toLogin() {
    this.navCtrl.navigateForward("login")
  }
}