import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDoc, getFirestore,doc } from 'firebase/firestore';

@Component({
  selector: 'app-info-veiculo',
  templateUrl: './info-veiculo.page.html',
  styleUrls: ['./info-veiculo.page.scss'],
})
export class InfoVeiculoPage implements OnInit {

  constructor(public routerCtrl : Router,
              public loadCtrl : LoadingController,
              public alertCtrl : AlertController,
              public navCtrl : NavController) {
    const nav = this.routerCtrl.getCurrentNavigation();
    this.idVeiculo = nav.extras.state.idVeiculo
   }

  auth = getAuth()
  userEmail : string
  idVeiculo : string

  placaVeiculo : string
  tipoVeiculo : string
  marcaVeiculo : string
  modeloVeiculo : string
  anoVeiculo : string
  cilindradaVeiculo : string
  kmAtualVeiculo : number
  
  proxRevKmVeiculo : number
  proxTrOleoKmVeiculo : number

  ngOnInit() {
    onAuthStateChanged(this.auth, user => {
      this.userEmail = user.email
      this.carregarDados()
    })
  }

  async carregarDados(){
    const load = await this.loadCtrl.create({
      message: 'Carregando dados...'
    })
    load.present()
    const veiculo = await getDoc(doc(collection(getFirestore(),`users/${this.userEmail}/veiculos`), this.idVeiculo))
    if(veiculo.exists){
      this.placaVeiculo = veiculo.get('placa')
      this.tipoVeiculo = veiculo.get('tipoVeiculo')
      this.tipoVeiculo = this.tipoVeiculo[0].toUpperCase() + this.tipoVeiculo.substring(1);
      this.marcaVeiculo = veiculo.get('marca')
      this.modeloVeiculo = veiculo.get('modelo')
      this.anoVeiculo = veiculo.get('ano')
      this.cilindradaVeiculo = veiculo.get('cilindrada')
      this.kmAtualVeiculo = veiculo.get('kmAtual')

      this.proxRevKmVeiculo = veiculo.get('proxRevKm')
      this.proxTrOleoKmVeiculo = veiculo.get('proxTrocaOleoKm')
    }
    load.dismiss()
  }

}
