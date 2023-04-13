import { getDocs, collection, getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { MenuController, NavController, ActionSheetController, LoadingController, AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-abastecimentos',
  templateUrl: './abastecimentos.page.html',
  styleUrls: ['./abastecimentos.page.scss'],
})
export class AbastecimentosPage implements OnInit {

  constructor(
    public menuCtrl: MenuController,
    public navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public loadCtrl: LoadingController) { }

  auth = getAuth()
  email: string
  veiculos: any[]
  medias: any[] = []
  valorTotal : number = 0
  quantidadeTotal : number = 0
  mediaTotal : number = 0
  selectVeiculoExibeAbast: string


  ngOnInit() {
    this.menuCtrl.enable(true)
    onAuthStateChanged(this.auth, usuario => {
      this.email = usuario.email
      this.carregarVeiculos()
    })
  }

  async carregarVeiculos() {
    const load = await this.loadCtrl.create({
      message: 'Carregando seus veículos...'
    })
    load.present()
    var i = 0
    this.veiculos = []
    const consulta = await getDocs(collection(getFirestore(), `users/${this.email}/veiculos`))
    if (!consulta.empty) {
      consulta.forEach(doc => {
        this.veiculos[i] = {
          id: doc.id,
          indice: i,
          placa: doc.get('placa'),
          modelo: doc.get('modelo')
        }
        console.log(this.veiculos[i])
        i++
      })
      load.dismiss()
    } else {
      load.dismiss()
      this.actionSheetSemVeiculos()
    }
  }

  async actionSheetSemVeiculos() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Sem veículos...',
      subHeader: 'Você não tem veículos cadastrados, deseja cadastrar agora?',
      buttons: [{
        text: 'Sim!',
        handler: () => {
          this.navCtrl.navigateForward('cadastro-veiculos');
        }
      }, {
        text: 'Mais tarde.',
        handler: () => {
          this.navCtrl.navigateForward('home')
        }
      }]
    })

    await actionSheet.present()
  }

  async carregarMedias() {
    const load = await this.loadCtrl.create({
      message: 'Carregando abastecimentos...'
    })
    load.present()
    var i = 0
    var j = 0
    var control = 1
    var desordenado = []
    var ordenador
    this.medias = []
    const consulta = await getDocs(collection(getFirestore(), `users/${this.email}/medias`))
    consulta.forEach(doc => {
      if (doc.get('placa') == this.selectVeiculoExibeAbast) {
        desordenado[i] = doc.data()
        console.log(desordenado[i])
        i++
      }
    })
    while (control != 0) {
      control = 0;
      for (j = 0; j < desordenado.length; j++) {
        if (desordenado[j + 1] != null) {
          if (desordenado[j].data < desordenado[j + 1].data) {
            ordenador = desordenado[j + 1];
            desordenado[j + 1] = desordenado[j];
            desordenado[j] = ordenador;
            control++;
          }
        }
      }
    }
    this.medias = desordenado
    this.mediaTotal = 0
    this.valorTotal = 0
    this.quantidadeTotal = 0
    this.medias.forEach(media => {
      this.valorTotal += (media.valorLitro * media.qdtAbastecida)
      this.quantidadeTotal += media.qdtAbastecida
      this.mediaTotal += media.media
      control++
    })
    this.mediaTotal = (this.mediaTotal/control)
    load.dismiss()
    if (i == 0) {
      this.alertSemAbastecimentos()
    }
  }

  async alertSemAbastecimentos() {
    const alert = await this.alertCtrl.create({
      header: 'Ops...',
      message: 'O Veículo selecionado não possui abastecimentos',
      buttons: ['Ok']
    })
    alert.present()
  }

  toHome() {
    this.navCtrl.navigateForward('home')
  }
}
