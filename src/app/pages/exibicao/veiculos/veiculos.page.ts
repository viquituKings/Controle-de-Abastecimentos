import { getDocs, collection, getFirestore, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { ActionSheetController, AlertController, MenuController, NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-veiculos',
  templateUrl: './veiculos.page.html',
  styleUrls: ['./veiculos.page.scss'],
})
export class VeiculosPage implements OnInit {

  constructor(public menuCtrl : MenuController, 
    public navCtrl : NavController, 
    public actionSheetCtrl : ActionSheetController, 
    public alertCtrl : AlertController) { }

  auth = getAuth()
  userEmail : string
  veiculos  : any[] = []

  ngOnInit() {
    this.menuCtrl.enable(true)
    onAuthStateChanged(this.auth, (usuario) => {
      if(usuario){
        this.userEmail = usuario.email
        this.carregarVeiculos()
      }
    })
    
  }

  toHome(){
    this.navCtrl.navigateForward('home')
  }

  async carregarVeiculos(){
    this.veiculos = []
    var i = 0
    const consulta = await getDocs(collection(getFirestore(), `users/${this.userEmail}/veiculos`))
    if(!consulta.empty){
      consulta.forEach( doc => {
          this.veiculos[i] = {
            placa   : doc.get('placa'),
            modelo  : doc.get('modelo'),
            marca   : doc.get('marca'),
            ano     : doc.get('ano'),
            kmAtual : doc.get('kmAtual'),
            id      : doc.id,
          }
          i++
      })
    }else{
      this.actionSemVeiculos()
    }
  }

  async deletarVeiculo(idVeiculo : string){
    await deleteDoc(doc(collection(getFirestore(), `users/${this.userEmail}/veiculos`), idVeiculo))
      .then(ok => {
        console.log('veiculo deletado')
        this.navCtrl.navigateRoot('home')
      }).catch( erro => {
        console.log(erro)
      })
  }

  async actionSemVeiculos(){
    const actionSheet = await this.actionSheetCtrl.create({
      animated: true,
      header: 'Sem veículos...',
      subHeader: 'Você não tem veículos cadastrados, deseja cadastrar agora?',
      buttons: [
        {
          text: "Sim!",
          handler: () => {
            this.navCtrl.navigateForward("cadastro-veiculos")
          }
        },
        {
          text: "Mais tarde.",
          role: 'cancel'
        }
      ]
    })
    await actionSheet.present()
  }

  async alertConfExcluirVeiculo(veiculoId : string){
    const alert = await this.alertCtrl.create({
      header: 'Deseja mesmo deletar este veículo?',
      subHeader: 'Esta ação não pode ser desfeita.',
      buttons: [
        {
        text: 'Sim!',
        handler: () => {
          this.deletarVeiculo(veiculoId)
        },
      },
      {
        text: 'Não.',
        role: 'cancel'
      }
    ]
    })
    await alert.present()
  }

}
