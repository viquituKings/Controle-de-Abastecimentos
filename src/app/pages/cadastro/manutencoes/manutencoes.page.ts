import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, getFirestore, setDoc, doc, updateDoc } from 'firebase/firestore';

@Component({
  selector: 'app-manutencoes',
  templateUrl: './manutencoes.page.html',
  styleUrls: ['./manutencoes.page.scss'],
})
export class ManutencoesPage implements OnInit {

  constructor(private loadCtrl: LoadingController,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) { }

  auth = getAuth()
  userEmail: string = ''
  selectVeiculoCadMan: number = null
  selectManutencaoCadMan: number = null
  selectLadoManutencaoCadMan: string = ''
  inputKmManutencaoCadMan: number = null
  inputDataManutencaoCadMan: string = ''
  inputValorManutencaoCadMan: number = null
  inputObsManutencaoCadMan: string = ''
  veiculos: any = []
  lados: any = []
  manutencoes: any = []

  ngOnInit() {
    onAuthStateChanged(this.auth, user => {
      this.userEmail = user.email
      this.carregarVeiculos()
    })
    this.lados[0] = {
      index: 0,
      valor: 'DIREITA',
      nome: 'Direita'
    }
    this.lados[1] = {
      index: 1,
      valor: 'ESQUERDA',
      nome: 'Esquerda'
    }
    this.lados[2] = {
      index: 2,
      valor: 'DIANTEIRA',
      nome: 'Dianteira'
    }
    this.lados[3] = {
      index: 3,
      valor: 'TRASEIRA',
      nome: 'Traseira'
    }

    this.manutencoes[0] = {
      index: 0,
      valor: 'PNEUS',
      nome: 'Pneus',
      lado: true
    }
    this.manutencoes[1] = {
      index: 1,
      valor: 'TROLEO',
      nome: 'Troca de Óleo',
      lado: false
    }
    this.manutencoes[2] = {
      index: 2,
      valor: 'REVISAO',
      nome: 'Revisão',
      lado: false
    }
    this.manutencoes[3] = {
      index: 3,
      valor: 'MANMOTOR',
      nome: 'Manutenção no motor',
      lado: false
    }
    this.manutencoes[4] = {
      index: 4,
      valor: 'MANFREIO',
      nome: 'Manutenção nos Freios',
      lado: true
    }
    this.manutencoes[5] = {
      index: 5,
      valor: 'LATARIA',
      nome: 'Lanternagem/Pintura',
      lado: false
    }
  }

  async carregarVeiculos() {
    let i = 0
    this.selectVeiculoCadMan = null
    this.selectManutencaoCadMan = null
    this.selectLadoManutencaoCadMan = ''
    this.inputKmManutencaoCadMan = null
    this.inputDataManutencaoCadMan = ''
    this.inputValorManutencaoCadMan = null
    this.inputObsManutencaoCadMan = ''
    const load = await this.loadCtrl.create({
      message: 'Carregando informações...'
    })
    load.present()
    const consulta = await getDocs(collection(getFirestore(), `users/${this.userEmail}/veiculos`))
    consulta.forEach(doc => {
      this.veiculos[i] = doc.data()
      this.veiculos[i].index = i
      this.veiculos[i].id = doc.id
      i++
    })
    console.log(this.veiculos)
    load.dismiss()
  }

  habilitaManutencoes() {
    const campo = document.getElementById('select-manutencoes').setAttribute('disabled', 'false')
  }
  habilitaLado() {
    if (this.manutencoes[this.selectManutencaoCadMan].lado == true) {
      const campo = document.getElementById('select-lado').setAttribute('disabled', 'false')
    } else {
      const campo = document.getElementById('select-lado').setAttribute('disabled', 'true')
    }
  }

  async cadastrar() {
    const load = await this.loadCtrl.create({
      message: 'Tentando cadastrar...'
    })
    let dados = {}
    if (this.selectVeiculoCadMan != null && this.selectManutencaoCadMan != null && this.inputDataManutencaoCadMan != '' && this.inputKmManutencaoCadMan != null && this.inputValorManutencaoCadMan != null) {
      load.present()
      dados = {
        dataCadastro: this.inputDataManutencaoCadMan,
        descricaoManutencao: this.inputObsManutencaoCadMan,
        kmManutencao: this.inputKmManutencaoCadMan,
        ladoManutencao: this.selectLadoManutencaoCadMan,
        tipoManutencaoVal: this.manutencoes[this.selectManutencaoCadMan].valor,
        tipoManutencao: this.manutencoes[this.selectManutencaoCadMan].nome,
        valorManutencao: this.inputValorManutencaoCadMan,
        veiculo: this.veiculos[this.selectVeiculoCadMan].placa,
        veiculoId: this.veiculos[this.selectVeiculoCadMan].id
      }
      setDoc(doc(collection(getFirestore(), `users/${this.userEmail}/manutencoes`)), dados).then(ok => {
        switch (this.manutencoes[this.selectManutencaoCadMan].valor) {
          case 'TROLEO':
            updateDoc(doc(collection(getFirestore(), `users/${this.userEmail}/veiculos`), this.veiculos[this.selectVeiculoCadMan].id), {
              ultimaTrocaOleoKm: this.inputKmManutencaoCadMan,
              proxTrocaOleoKm: (this.inputKmManutencaoCadMan + this.veiculos[this.selectVeiculoCadMan].trocaOleoKm),
              gastoManutencao: (this.veiculos[this.selectVeiculoCadMan].gastoManutencao + this.inputValorManutencaoCadMan)
            }).then(updateOk => {
              this.gerenciadorToast("Manutenção cadastrada com sucesso", "checkmark-circle")
              this.carregarVeiculos()
              this.toHome()
            }).catch(erroUpdate => {
              console.log('erro no update')
            })
            break;
          case 'REVISAO':
            updateDoc(doc(collection(getFirestore(), `users/${this.userEmail}/veiculos`), this.veiculos[this.selectVeiculoCadMan].id), {
              ultimaTrocaOleoKm: this.inputKmManutencaoCadMan,
              ultimaRevisaoKm: this.inputKmManutencaoCadMan,
              proxTrocaOleoKm: (this.inputKmManutencaoCadMan + this.veiculos[this.selectVeiculoCadMan].trocaOleoKm),
              proxRevKm: (this.inputKmManutencaoCadMan + this.veiculos[this.selectVeiculoCadMan].revisaoKm),
              gastoManutencao: (this.veiculos[this.selectVeiculoCadMan].gastoManutencao + this.inputValorManutencaoCadMan)
            }).then(updateOk => {
              this.gerenciadorToast("Manutenção cadastrada com sucesso", "checkmark-circle")
              this.carregarVeiculos()
              this.toHome()
            }).catch(erroUpdate => {
              console.log('erro no update')
            })
            break;
          default:
            updateDoc(doc(collection(getFirestore(), `users/${this.userEmail}/veiculos`), this.veiculos[this.selectVeiculoCadMan].id), {
              gastoManutencao: (this.veiculos[this.selectVeiculoCadMan].gastoManutencao + this.inputValorManutencaoCadMan)
            }).then(updateOk => {
              this.gerenciadorToast("Manutenção cadastrada com sucesso", "checkmark-circle")
              this.carregarVeiculos()
              this.toHome()
            }).catch(erroUpdate => {
              console.log('erro no update')
            })
            break;
        }
      }).catch(erroCadastro => {
        this.gerenciadorToast("Erro ao cadastrar manutenção.", "close-circle")
      })
      load.dismiss()
    } else {
      this.gerenciadorToast("Preencha todos os campos.", "close-circle")
    }
    console.log(dados)
  }

  async gerenciadorToast(mensagem: string, icone: string) {
    const toast = await this.toastCtrl.create({
      message: mensagem,
      icon: icone,
      duration: 1500
    })
    toast.present()
  }

  toHome(){
    this.navCtrl.navigateForward('home')
  }

}
