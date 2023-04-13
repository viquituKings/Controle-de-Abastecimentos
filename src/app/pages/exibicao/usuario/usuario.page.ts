import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { EmailAuthCredential, EmailAuthProvider, deleteUser, getAuth, onAuthStateChanged, reauthenticateWithCredential, signInWithEmailAndPassword, updateEmail, updateProfile } from 'firebase/auth';
import { collection, deleteDoc, getDocs, getFirestore, doc } from 'firebase/firestore';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit {

  constructor(public alertCtrl: AlertController,
    public loadCtrl: LoadingController,
    public toastCtrl: ToastController,
    public navCtrl: NavController) { }

  auth = getAuth()
  nomeUsuario: string
  emailUsuario: string

  async ngOnInit() {
    const loadTela = await this.loadCtrl.create({
      message: 'Buscando informações...'
    })
    loadTela.present()
    onAuthStateChanged(this.auth, user => {
      if (user) {
        this.nomeUsuario = user.displayName
        this.emailUsuario = user.email
      }
      loadTela.dismiss()
    })
  }


  async alertEdit() {
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
      inputs: [
        {
          name: 'novoNome',
          placeholder: 'Seu nome:',
          type: 'text',
          attributes: {
            autocomplete: 'name'
          }
        },
      ],
      buttons: [
        {
          text: 'Atualizar!',
          handler: (alertData) => {
            load.present()
            if (alertData.novoNome != "" && alertData.novoEmail != "") {
              updateProfile(this.auth.currentUser, {
                displayName: alertData.novoNome
              }).then(() => {
                toastOk.present()
                this.toHome()
              }).catch(() => {
                toastFail.present()
              })
            } else {
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

  async alertAvisoApagar() {
    const alert = await this.alertCtrl.create({
      header: 'Tem certeza disso?',
      subHeader: 'Você está prestes a excluir sua conta e esta operação não pode ser desfeita.',
      message: 'Todos seus dados pessoais, de veículos e abastecimentos serão apagados.</br> </br> Para continuar, confirme seus dados:',
      inputs: [
        {
          placeholder: 'email',
          type: 'email',
          name: 'email'
        },
        {
          placeholder: 'Senha',
          type: 'password',
          name: 'senha'
        }
      ],
      buttons: [
        {
          text: 'Cancelar.',
          role: 'cancel'
        },
        {
          text: 'Apagar!',
          handler: (alertData) => {
            reauthenticateWithCredential(this.auth.currentUser, EmailAuthProvider.credential(alertData.email, alertData.senha)).then(() => {
              this.apagarDocumentos()
            }).catch(() => {
              this.toastErroExclusao()
            })

          }
        }
      ]
    })
    alert.present()
  }

  async apagarDocumentos() {
    var i = 0
    var j = 0
    var idDocsVeiculos = []
    var idDocsAbastecimentos = []
    const load = await this.loadCtrl.create({
      message: 'Tentando realizar a exclusão...'
    })
    load.present()
    // Criação das consultas
    const consultaVeiculos = await getDocs(collection(getFirestore(), `users/${this.emailUsuario}/veiculos`))
    const consultaAbastecimentos = await getDocs(collection(getFirestore(), `users/${this.emailUsuario}/medias`))
    //filtrando consulta
    consultaVeiculos.forEach(doc => {
      idDocsVeiculos[i] = doc.id
      i++
    })
    consultaAbastecimentos.forEach(doc => {
      idDocsAbastecimentos[j] = doc.id
      j++
    })
    //apagando dados
    idDocsAbastecimentos.forEach(id => {
      deleteDoc(doc(collection(getFirestore(), `users/${this.emailUsuario}/medias`), id)).then(() => {
        console.log(`abastecimento ${id} apagado!`)
      }).catch(() => {
        load.dismiss()
        this.toastErroExclusao()
      })
    })

    idDocsVeiculos.forEach(id => {
      deleteDoc(doc(collection(getFirestore(), `users/${this.emailUsuario}/veiculos`), id)).then(() => {
        console.log(`veiculo ${id} apagado!`)
      }).catch(() => {
        load.dismiss()
        this.toastErroExclusao()
      })
    })

    //excluindo conta
    deleteUser(this.auth.currentUser).then(() => {
      load.dismiss()
      this.toastExcluido()
      this.toLogin()
    }).catch(() => {
      load.dismiss()
      this.toastErroExclusao()
    })
  }

  async toastErroExclusao() {
    const toast = await this.toastCtrl.create({
      message: 'Não foi possível realizar a exclusão.',
      duration: 1500,
      icon: 'close-circle-outline'
    })
    toast.present()
  }

  async toastExcluido() {
    const toast = await this.toastCtrl.create({
      message: 'Dados e usuário excluídos!',
      duration: 1500,
      icon: 'checkmark-circle-outline'
    })
    toast.present()
  }

  toHome() {
    this.navCtrl.navigateForward('home')
  }

  toLogin() {
    this.navCtrl.navigateRoot('')
  }

}