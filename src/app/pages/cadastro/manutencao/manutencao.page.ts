import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getFirestore, updateDoc } from 'firebase/firestore';

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
    public navCtrl: NavController,
    public routeCtrl: Router
  ) {
    const nav = routeCtrl.getCurrentNavigation()
    this.selectVeiculo = nav.extras.state.idVeiculo
  }

  auth = getAuth()
  userEmail = ''
  selectVeiculo: string
  revKms: number
  revMeses: number
  oleoKms: number
  oleoMeses: number
  ultimaRevKm: number
  ultimaTrocaOleoKm: number

  ngOnInit() {
    onAuthStateChanged(this.auth, user => {
      if (user) {
        this.userEmail = user.email
        console.log(this.userEmail)
      }
    })
  }

  async toastCadOk() {
    const toast = await this.toastCtrl.create({
      message: "Informações cadastradas com sucesso!",
      duration: 1500,
      icon: 'checkmark-circle-outline',
    })
    toast.present()
  }

  async toastCadFail() {
    const toast = await this.toastCtrl.create({
      message: "Alguma coisa esta errada!",
      duration: 1500,
      icon: 'close-circle-outline',
    })
    toast.present()
  }

  calcularProxRev(){
    var cont = false
    var proxRev = this.ultimaRevKm

    while (cont === false){
      if(this.ultimaRevKm >= this.revKms){
        proxRev += this.revKms
        if(proxRev > this.ultimaRevKm){
          cont = true
        }
      }else if (this.ultimaRevKm < this.revKms){
        proxRev = this.revKms
        cont = true
      }
    }

    return proxRev
  }

  async cadManutencao() {
    console.log(this.selectVeiculo)
    const load = await this.loadCtrl.create({
      message: "cadastrando informações..."
    })
    load.present()
    await updateDoc(doc(collection(getFirestore(), `users/${this.userEmail}/veiculos`), this.selectVeiculo), {
      revisaoKm: this.revKms,
      revisaoMes: this.revMeses,
      trocaOleoKm: this.oleoKms,
      trocaOleoMeses: this.oleoMeses,
      ultimaRevisaoKm: this.ultimaRevKm,
      ultimaTrocaOleoKm: this.ultimaTrocaOleoKm,
      proxRevKm: this.calcularProxRev(),
      proxTrocaOleoKm: (this.ultimaTrocaOleoKm + this.oleoKms),
      cadManPeriodica: true
    }).then(() => {
      this.toastCadOk()
      this.routeCtrl.navigateByUrl('/exibir-manutencao-periodica', {
        state: { idVeiculo: this.selectVeiculo }
      })
      load.dismiss()
    }).catch(() => {
      this.toastCadFail()
      load.dismiss()
    })
  }

}
