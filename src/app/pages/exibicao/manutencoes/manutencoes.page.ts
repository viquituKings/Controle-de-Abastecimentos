import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, getFirestore } from 'firebase/firestore';

@Component({
  selector: 'app-manutencoes',
  templateUrl: './manutencoes.page.html',
  styleUrls: ['./manutencoes.page.scss'],
})
export class ManutencoesPage implements OnInit {

  constructor(private alertCtrl: AlertController,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private loadCtrl: LoadingController
  ) { }
  auth = getAuth()
  userEmail: string = ''
  selectVeiculo: number = null
  selectTipoMan: string = 'TODAS'
  tiposManutencao: any = []
  veiculos: any = []
  qtdManutencoes: number = 0
  valManutencoes: number = 0
  manutencoes: any = []

  ngOnInit() {
    this.tiposManutencao[1] = {
      index: 1,
      valor: 'PNEUS',
      nome: 'Pneus',
      lado: true
    }
    this.tiposManutencao[2] = {
      index: 2,
      valor: 'TROLEO',
      nome: 'Troca de Óleo',
      lado: false
    }
    this.tiposManutencao[3] = {
      index: 3,
      valor: 'REVISAO',
      nome: 'Revisão',
      lado: false
    }
    this.tiposManutencao[4] = {
      index: 4,
      valor: 'MANMOTOR',
      nome: 'Manutenção no motor',
      lado: false
    }
    this.tiposManutencao[5] = {
      index: 5,
      valor: 'MANFREIO',
      nome: 'Manutenção nos Freios',
      lado: true
    }
    this.tiposManutencao[6] = {
      index: 6,
      valor: 'LATARIA',
      nome: 'Lanternagem/Pintura',
      lado: false
    }
    this.tiposManutencao[0] = {
      index: 0,
      valor: 'TODAS',
      nome: 'Todas',
      lado: false
    }
    onAuthStateChanged(this.auth, user => {
      this.userEmail = user.email
      this.carregarVeiculos()
    })
  }

  async carregarVeiculos() {
    const load = await this.loadCtrl.create({
      message: "Buscando veículos..."
    })
    load.present()
    let i = 0
    const consulta = await getDocs(collection(getFirestore(), `users/${this.userEmail}/veiculos`))
    consulta.forEach(doc => {
      this.veiculos[i] = doc.data()
      this.veiculos[i].id = doc.id
      this.veiculos[i].index = i
      i++
    })
    load.dismiss()
  }

  async carregarManutencoes() {
    let i = 0
    let j = 0
    let desordenado = []
    let ordenador
    let control = 1
    let valorMan = 0
    this.manutencoes = []
    if (this.selectVeiculo != null) {
      const consulta = await getDocs(collection(getFirestore(), `users/${this.userEmail}/manutencoes`))
      if (this.selectTipoMan != 'TODAS') {
        consulta.forEach(doc => {
          if (doc.get('tipoManutencaoVal') == this.selectTipoMan && doc.get('veiculoId') == this.veiculos[this.selectVeiculo].id) {
            desordenado[i] = doc.data()
            valorMan += doc.get('valorManutencao')
            i++
          }
        })
      } else {
        consulta.forEach(doc => {
          if(doc.get('veiculoId') == this.veiculos[this.selectVeiculo].id){
            desordenado[i] = doc.data()
            valorMan += doc.get('valorManutencao')
            i++
          }
        })
      }

      this.qtdManutencoes = i
      this.valManutencoes = valorMan

      while (control != 0) {
        control = 0;
        for (j = 0; j < desordenado.length; j++) {
          if (desordenado[j + 1] != null) {
            if (desordenado[j].dataCadastro < desordenado[j + 1].dataCadastro) {
              ordenador = desordenado[j + 1];
              desordenado[j + 1] = desordenado[j];
              desordenado[j] = ordenador;
              control++;
            }
          }
        }
      }
      this.manutencoes = desordenado
    }
  }

}
