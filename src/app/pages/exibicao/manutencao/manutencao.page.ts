import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDoc, getFirestore, doc, updateDoc, setDoc, getDocs } from 'firebase/firestore';

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
  manFreioDiant: number
  manFreioTras: number
  tipoManutencao: any = []
  selectTipoMan: string = 'TODAS'
  manutencoes: any = []

  ngOnInit() {
    onAuthStateChanged(this.auth, user => {
      this.userEmail = user.email
      this.tipoManutencao[0] = {
        nome: 'Freios',
        valor: 'MANFREIO'
      }
      this.tipoManutencao[1] = {
        nome: 'Troca de óleo',
        valor: 'TROLEO'
      }
      this.tipoManutencao[2] = {
        nome: 'Revisão',
        valor: 'REVISAO'
      }
      this.tipoManutencao[3] = {
        nome: 'Todas',
        valor: 'TODAS'
      }
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
        this.veiculo.id = veiculo.id
        this.modPlaca = (veiculo.get('marca') + " " + veiculo.get('modelo') + " - " + veiculo.get('placa'))
        this.ultimaRevKm = veiculo.get('ultimaRevisaoKm')
        this.proxRevKm = veiculo.get('proxRevKm')
        this.ultimaTrocaOleoKm = veiculo.get('ultimaTrocaOleoKm')
        this.proxTrocaOleoKm = veiculo.get('proxTrocaOleoKm')
        this.manFreioDiant = veiculo.get('manFreioDiant')
        this.manFreioTras = veiculo.get('manFreioTras')
        load.dismiss()
        this.buscarManutencoes()
      } else {
        load.dismiss()
        this.verificarManPeriodica()
      }
    }
  }

  async buscarManutencoes() {
    const load = await this.loadCtrl.create({
      message: 'Carregando manutenções...'
    })
    load.present()
    this.manutencoes = []
    let i = 0
    const consulta = await getDocs(collection(getFirestore(), `users/${this.userEmail}/manutencoes`))
    consulta.forEach(doc => {
      if (doc.get('veiculoId') === this.veiculo.id) {
        if (this.selectTipoMan == 'TODAS') {
          this.manutencoes[i] = doc.data()
          i++
        } else if (doc.get('tipoManutencaoVal') === this.selectTipoMan) {
          this.manutencoes[i] = doc.data()
          i++
        }
      }
    })
    console.log(this.manutencoes)
    load.dismiss()
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

  async geradorToast(mensagem: string, icone: string) {
    const toast = await this.toastCtrl.create({
      message: mensagem,
      duration: 1500,
      icon: icone
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
      mode: 'ios',
      header: 'Cadastro de revisão',
      subHeader: 'Preencha os campos corretamente:',
      inputs: [
        {
          name: 'ultimaRev',
          placeholder: 'Km na revisão:',
          type: 'number'
        },
        {
          name: 'descRev',
          placeholder: 'Observação: (opcional)',
          type: 'textarea'
        },
      ],
      buttons: [
        {
          text: 'Cadastrar',
          handler: (alertData) => {
            if (alertData.ultimaRev != 0) {
              load.present()
              setDoc(doc(collection(getFirestore(), `users/${this.userEmail}/manutencoes`)), {
                tipoManutencao: "Revisão",
                tipoManutencaoVal: "REVISAO",
                kmManutencao: alertData.ultimaRev,
                descricaoManutencao: alertData.descRev,
                dataCadastro: `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
                veiculo: this.veiculo.placa,
                veiculoId: this.veiculo.id
              }).then(() => {
                updateDoc(doc(collection(getFirestore(), `users/${this.userEmail}/veiculos`), this.idVeiculo), {
                  ultimaRevisaoKm: Number(alertData.ultimaRev),
                  proxRevKm: this.calcularProxRev(this.veiculo.revisaoKm, Number(alertData.ultimaRev)),
                  proxTrocaOleoKm: (this.veiculo.trocaOleoKm + Number(alertData.ultimaRev)),
                  ultimaTrocaOleoKm: Number(alertData.ultimaRev)
                }).then(() => {
                  this.geradorToast("Revisão cadastrada!", "checkmark-circle")
                  load.dismiss()
                  this.navCtrl.navigateBack('exibir-veiculos')
                }).catch(() => {
                  load.dismiss()
                  this.geradorToast("Algo deu errado, tente novamente", "close-circle")
                })
              })
            } else {
              load.dismiss()
              this.geradorToast("Preencha o campo obrigatório.", "close-circle")
            }

          }
        },
        {
          text: 'Cancelar',
          role: 'destructive'
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
      mode: 'ios',
      header: 'Cadastro de troca de óleo',
      subHeader: 'Preencha os campos corretamente:',
      inputs: [
        {
          name: 'ultimaTrOleo',
          placeholder: 'Km na troca:',
          type: 'number'
        },
        {
          name: 'descTrOleo',
          placeholder: 'Observação: (opcional)',
          type: 'textarea'
        },
      ],
      buttons: [
        {
          text: 'Cadastrar!',
          handler: (alertData) => {
            if (alertData.ultimaTrOleo != 0) {
              load.present()
              setDoc(doc(collection(getFirestore(), `users/${this.userEmail}/manutencoes`)), {
                tipoManutencao: "Troca de Óleo",
                tipoManutencaoVal: "TROLEO",
                kmManutencao: alertData.ultimaTrOleo,
                descricaoManutencao: alertData.descTrOleo,
                dataCadastro: `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
                veiculo: this.veiculo.placa,
                veiculoId: this.veiculo.id
              }).then(() => {
                updateDoc(doc(collection(getFirestore(), `users/${this.userEmail}/veiculos`), this.idVeiculo), {
                  proxTrocaOleoKm: (this.veiculo.trocaOleoKm + Number(alertData.ultimaTrOleo)),
                  ultimaTrocaOleoKm: Number(alertData.ultimaTrOleo)
                }).then(() => {
                  this.geradorToast("Troca de óleo cadastrada!", "checkmark-circle")
                  load.dismiss()
                  this.navCtrl.navigateBack('exibir-veiculos')
                }).catch(() => {
                  load.dismiss()
                  this.geradorToast("Algo deu errado, tente novamente", "close-circle")
                })
              })
            } else {
              load.dismiss()
              this.geradorToast("Preencha o campo obrigatório.", "close-circle")
            }
          }
        },
        {
          text: 'Cancelar',
          role: 'destructive'
        }
      ]
    })
    await alert.present()
  }

  async cadLadoManFreios() {
    const alert1 = await this.alertCtrl.create({
      mode: 'ios',
      header: "Manutenção nos freios",
      subHeader: "Selecione o freio:",
      inputs: [
        {
          name: "dianteiro",
          type: "radio",
          label: "Dianteiro",
          value: 1
        },
        {
          name: "traseiro",
          type: "radio",
          label: "Traseiro",
          value: 2
        },
      ],
      buttons: [
        {
          text: "Confirmar",
          handler: (alertData) => {
            this.cadManFreios(alertData)
          }
        },
        {
          text: "Cancelar",
          role: 'destructive'
        }
      ]
    })
    alert1.present()
  }

  async cadManFreios(ladoFreios: number) {
    var freio: string
    if (ladoFreios == 1) {
      freio = "Dianteiros"
    } else if (ladoFreios == 2) {
      freio = "Traseiros"
    } else {
      this.geradorToast("Selecione o lado do freio.", "close-circle")
      this.cadLadoManFreios()
    }
    const load = await this.loadCtrl.create({
      message: "Tentando cadastrar..."
    })
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: "Manutenção nos freios",
      message: "Freios " + freio,
      subHeader: "Insira o Km da manutenção realizada:",
      inputs: [
        {
          name: "kmManFreio",
          type: "number",
          placeholder: "Km Manutenção"
        },
        {
          name: "descManFreio",
          type: "textarea",
          placeholder: "Observação: (opcional)"
        },
      ],
      buttons: [{
        text: "Confirmar",
        handler: (alertData) => {
          load.present()
          if (alertData.kmManFreio != 0) {
            setDoc(doc(collection(getFirestore(), `users/${this.userEmail}/manutencoes`)), {
              tipoManutencao: "Manutenção nos freios " + freio,
              tipoManutencaoVal: "MANFREIO",
              kmManutencao: alertData.kmManFreio,
              descricaoManutencao: alertData.descManFreio,
              dataCadastro: `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
              veiculo: this.veiculo.placa,
              veiculoId: this.veiculo.id
            }).then(() => {
              if (freio == "Dianteiros") {
                updateDoc(doc(collection(getFirestore(), `users/${this.userEmail}/veiculos`), this.idVeiculo), {
                  manFreioDiant: Number(alertData.kmManFreio)
                }).then(() => {
                  this.geradorToast("Manutenção cadastrada!", "checkmark-circle")
                  load.dismiss()
                  this.navCtrl.navigateBack('exibir-veiculos')
                }).catch(() => {
                  load.dismiss()
                  this.geradorToast("Algo deu errado, tente novamente", "close-circle")
                })
              } else if (freio == "Traseiros") {
                updateDoc(doc(collection(getFirestore(), `users/${this.userEmail}/veiculos`), this.idVeiculo), {
                  manFreioTras: Number(alertData.kmManFreio)
                }).then(() => {
                  this.geradorToast("Manutenção cadastrada!", "checkmark-circle")
                  load.dismiss()
                  this.navCtrl.navigateBack('exibir-veiculos')
                }).catch(() => {
                  load.dismiss()
                  this.geradorToast("Algo deu errado, tente novamente", "close-circle")
                })
              }
            })
          } else {
            load.dismiss()
            this.geradorToast("Preencha o campo obrigatório.", "close-circle")
          }
        }
      },
      {
        text: "Cancelar",
        role: "destructive"
      }]
    })
    if (freio != undefined) {
      alert.present()
    }

  }

  toCadManutencao() {
    this.routerCtrl.navigateByUrl('/cadastro-manutencao-periodica', {
      state: { idVeiculo: this.idVeiculo }
    })
  }

}
