import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDoc, getFirestore, doc, updateDoc } from 'firebase/firestore';

@Component({
  selector: 'app-manutencao',
  templateUrl: './manutencao.page.html',
  styleUrls: ['./manutencao.page.scss'],
})

export class ManutencaoPage implements OnInit {
  constructor(public routerCtrl: Router,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public loadCtrl: LoadingController,
    public navCtrl: NavController) {
    const nav = this.routerCtrl.getCurrentNavigation();
    this.idVeiculo = nav.extras.state.idVeiculo
  }

  auth = getAuth()
  userEmail: string
  idVeiculo: any
  veiculo: any
  modPlaca: string
  ultimaRevKm: number
  proxRevKm: number
  ultimaTrocaOleoKm: number
  proxTrocaOleoKm: number

  ngOnInit() {
    onAuthStateChanged(this.auth, user => {
      this.userEmail = user.email
      this.carregarDados()
    })
  }

  async carregarDados() {
    const load = await this.loadCtrl.create({
      message: 'Carregando dados...'
    })
    load.present()
    const veiculo = await getDoc(doc(collection(getFirestore(), `users/${this.userEmail}/veiculos`), this.idVeiculo))
    if (veiculo.exists()) {
      if (veiculo.get('cadManPeriodica') != null && veiculo.get('cadManPeriodica') != false) {
        this.veiculo = veiculo.data()
        this.modPlaca = (veiculo.get('modelo') + " - " + veiculo.get('placa'))
        this.ultimaRevKm = veiculo.get('ultimaRevisaoKm')
        this.proxRevKm = veiculo.get('proxRevKm')
        this.ultimaTrocaOleoKm = veiculo.get('ultimaTrocaOleoKm')
        this.proxTrocaOleoKm = veiculo.get('proxTrocaOleoKm')
        load.dismiss()
      }else{
        load.dismiss()
        this.verificarManPeriodica()
      }
    }
  }

  async verificarManPeriodica() {
    const alert = await this.alertCtrl.create({
      header: 'Ops...',
      subHeader: ' Seu veículo não possuí manutenção periódica cadastrada.',
      message: 'deseja cadastrar?',
      buttons: [
        {
          text: 'Sim!',
          handler: () => {
            this.toCadManutencao()
          }
        },
        {
          text: 'Não',
          handler: () => {
            this.navCtrl.navigateBack('exibir-veiculos')
          }
        }
      ]
    })
    alert.present()
  }

  async toastCadOk() {
    const toast = await this.toastCtrl.create({
      message: 'Cadastro Realizado com sucesso!',
      duration: 1500,
      icon: 'checkmark-circle-outline'
    })
    toast.present()
  }

  async toastCadErro() {
    const toast = await this.toastCtrl.create({
      message: 'Algo deu errado',
      duration: 1500,
      icon: 'close-circle-outline'
    })
    toast.present()
  }

  calcularProxRev(kmRev: number, km: number) {
    var cont = false
    var proxRev = km

    while (cont === false) {
      if (km >= kmRev) {
        proxRev += kmRev
        if (proxRev > km) {
          cont = true
        }
      } else if (km < kmRev) {
        proxRev = kmRev
        cont = true
      }
    }
    return proxRev
  }

  async cadRevisao() {
    const load = await this.loadCtrl.create({
      message: 'Tentando cadastrar...'
    })

    const alert = await this.alertCtrl.create({
      header: 'Cadastro de revisão',
      subHeader: 'Preencha os campos corretamente:',
      inputs: [
        {
          name: 'ultimaRev',
          placeholder: 'Km na revisão:',
          type: 'number'
        },
      ],
      buttons: [
        {
          text: 'Cadastrar!',
          handler: (alertData) => {
            load.present()
            updateDoc(doc(collection(getFirestore(), `users/${this.userEmail}/veiculos`), this.idVeiculo), {
              ultimaRevisaoKm: Number(alertData.ultimaRev),
              proxRevKm: this.calcularProxRev(this.veiculo.revisaoKm, Number(alertData.ultimaRev)),
              proxTrocaOleoKm: (this.veiculo.trocaOleoKm + Number(alertData.ultimaRev)),
              ultimaTrocaOleoKm: Number(alertData.ultimaRev)
            }).then(() => {
              this.toastCadOk()
              load.dismiss()
              this.navCtrl.navigateBack('exibir-veiculos')
            }).catch(() => {
              load.dismiss()
              this.toastCadErro()
            })
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    })
    await alert.present()
  }

  async cadTrocaOleo() {
    const load = await this.loadCtrl.create({
      message: 'Tentando cadastrar...'
    })
    const alert = await this.alertCtrl.create({
      header: 'Cadastro de troca de óleo',
      subHeader: 'Preencha os campos corretamente:',
      inputs: [
        {
          name: 'ultimaTrOleo',
          placeholder: 'Km na troca:',
          type: 'number'
        },
      ],
      buttons: [
        {
          text: 'Cadastrar!',
          handler: (alertData) => {
            load.present()
            updateDoc(doc(collection(getFirestore(), `users/${this.userEmail}/veiculos`), this.idVeiculo), {
              proxTrocaOleoKm: (this.veiculo.trocaOleoKm + Number(alertData.ultimaTrOleo)),
              ultimaTrocaOleoKm: Number(alertData.ultimaTrOleo)
            }).then(() => {
              this.toastCadOk()
              load.dismiss()
              this.navCtrl.navigateBack('exibir-veiculos')
            }).catch(() => {
              load.dismiss()
              this.toastCadErro()
            })
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    })
    await alert.present()
  }

  toCadManutencao() {
    this.routerCtrl.navigateByUrl('/cadastro-manutencao-periodica', {
      state: { idVeiculo: this.idVeiculo }
    })
  }

}
