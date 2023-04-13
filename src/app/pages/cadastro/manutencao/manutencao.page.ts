import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDocs, getFirestore, updateDoc } from 'firebase/firestore';

@Component({
  selector: 'app-manutencao',
  templateUrl: './manutencao.page.html',
  styleUrls: ['./manutencao.page.scss'],
})
export class ManutencaoPage implements OnInit {

  constructor(
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public loadCtrl: LoadingController,
    public navCtrl: NavController
  ) { }

  auth = getAuth()
  userEmail = ''
  veiculos: any
  selectVeiculo: string
  revKms: number
  revMeses: number
  oleoKms: number
  oleoMeses: number

  ngOnInit() {
    onAuthStateChanged(this.auth, user => {
      if (user) {
        this.userEmail = user.email
        this.carregarVeiculos()
      }
    })
  }

  async toastCadOk(){
    const toast = await this.toastCtrl.create({
      message: "Informações cadastradas com sucesso!",
      duration: 1500,
      icon: 'checkmark-circle-outline',
    })
    toast.present()
  }

  async toastCadFail(){
    const toast = await this.toastCtrl.create({
      message: "Alguma coisa esta errada!",
      duration: 1500,
      icon: 'close-circle-outline',
    })
    toast.present()
  }

  async carregarVeiculos() {
    const load = await this.loadCtrl.create({
      message: 'Carregando seus veículos...'
    })
    load.present()
    this.veiculos = []
    var i = 0
    const consulta = await getDocs(collection(getFirestore(), `users/${this.userEmail}/veiculos`))
    if (!consulta.empty) {
      consulta.forEach(doc => {
        this.veiculos[i] = doc.data()
        this.veiculos[i].id = doc.id
        console.log(this.veiculos[i])
        i++
        }
      )
    }
    load.dismiss()
  }

  async cadManutencao(){
    const load = await this.loadCtrl.create({
      message: "cadastrando informações..."
    })
    load.present()
    await updateDoc(doc(collection(getFirestore(),`users/${this.userEmail}/veiculos`),this.selectVeiculo), {
      revisaoKm: this.revKms,
      revisaoMes: this.revMeses,
      trocaOleoKm: this.oleoKms,
      trocaOleoMeses: this.oleoMeses,
      cadManPeriodica: true
    }).then(() => {
      this.toastCadOk()
      this.toHome()
      load.dismiss()
    }).catch(() => {
      this.toastCadFail()
      load.dismiss()
    })
  }

  toHome(){
    this.navCtrl.navigateForward('home')
  }

}
