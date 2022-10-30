import { getDocs, collection, getFirestore } from 'firebase/firestore';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { MenuController, NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-veiculos',
  templateUrl: './veiculos.page.html',
  styleUrls: ['./veiculos.page.scss'],
})
export class VeiculosPage implements OnInit {

  constructor(public menuCtrl : MenuController, public navCtrl : NavController) { }

  auth = getAuth()
  userEmail : string
  veiculos  : any[] = []

  ngOnInit() {
    this.menuCtrl.enable(true)
    onAuthStateChanged(this.auth, (usuario) => {
      if(usuario){
        console.log(usuario.email)
        this.userEmail = usuario.email
        this.carregarVeiculos()
      }
    })
    
  }

  toHome(){
    this.navCtrl.navigateForward('home')
  }

  async carregarVeiculos(){
    console.log(this.userEmail)
    this.veiculos = []
    var i = 0
    const consulta = await getDocs(collection(getFirestore(), `users/${this.userEmail}/veiculos`))
    consulta.forEach( doc => {
      this.veiculos[i] = doc.data()
      console.log(this.veiculos)
      i++
    })
  }
}
