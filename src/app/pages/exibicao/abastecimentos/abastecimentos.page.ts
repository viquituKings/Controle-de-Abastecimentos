import { getDocs, collection, getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { MenuController, NavController, ActionSheetController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-abastecimentos',
  templateUrl: './abastecimentos.page.html',
  styleUrls: ['./abastecimentos.page.scss'],
})
export class AbastecimentosPage implements OnInit {

  constructor(
    public menuCtrl : MenuController, 
    public navCtrl : NavController,
    public actionSheetCtrl : ActionSheetController) { }

  auth = getAuth()
  email : string
  veiculos : any[]
  medias : any[] = []
  selectVeiculoExibeAbast : string


  ngOnInit() {
    this.menuCtrl.enable(true)
    onAuthStateChanged(this.auth, usuario => {
      this.email = usuario.email
      this.carregarVeiculos()
    })
  }

  async carregarVeiculos(){
    var i = 0
    this.veiculos = []
    const consulta = await getDocs(collection(getFirestore(), `users/${this.email}/veiculos`))
    if(!consulta.empty){
      consulta.forEach( doc => {
        this.veiculos[i] = {
          id      : doc.id,
          indice  : i,
          placa   : doc.get('placa'),
          modelo  : doc.get('modelo')
        }
        console.log(this.veiculos[i])
        i++
      })
      }else{
        this.actionSheetSemVeiculos()
      }
    }

    async actionSheetSemVeiculos(){
      const actionSheet = await this.actionSheetCtrl.create({
        header: 'Sem veículos...',
        subHeader: 'Você não tem veículos cadastrados, deseja cadastrar agora?',
        buttons: [{
          text: 'Sim!',
          handler: () => {
            this.navCtrl.navigateForward('cadastro-veiculos');
          }
        },{
          text: 'Mais tarde.',
          handler: () => {
            this.navCtrl.navigateForward('home')
          }
        }]
      })

      await actionSheet.present()
    }

  async carregarMedias(){
    var i = 0
    this.medias = []
    const consulta = await getDocs(collection(getFirestore(), `users/${this.email}/medias`))
    consulta.forEach( doc => {
      if (doc.get('placa') == this.selectVeiculoExibeAbast){
        this.medias[i] = doc.data()
        console.log(this.medias[i])
        i++
      }
    })
  }

  toHome(){
    this.navCtrl.navigateForward('home')
  }
}
