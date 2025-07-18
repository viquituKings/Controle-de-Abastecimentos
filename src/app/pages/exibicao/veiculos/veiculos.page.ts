import { getDocs, collection, getFirestore, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { ActionSheetController, AlertController, MenuController, NavController, ToastController, LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-veiculos',
  templateUrl: './veiculos.page.html',
  styleUrls: ['./veiculos.page.scss'],
})
export class VeiculosPage implements OnInit {

  constructor(public menuCtrl : MenuController, 
    public navCtrl : NavController, 
    public actionSheetCtrl : ActionSheetController, 
    public alertCtrl : AlertController,
    public toastCtrl : ToastController,
    public loadCtrl : LoadingController,
    public routerCtrl : Router) { }

  auth = getAuth()
  userEmail : string
  veiculos  : any[] = []
  veiculoEditado : string

  ngOnInit() {
    this.menuCtrl.enable(true)
    onAuthStateChanged(this.auth, (usuario) => {
      if(usuario){
        this.userEmail = usuario.email
        this.carregarVeiculos()
      }
    })
    
  }

  async carregarVeiculos(){
    const load = await this.loadCtrl.create({
      message : 'Carregando seus veículos...'
    })
    load.present()
    this.veiculos = []
    var i = 0
    const consulta = await getDocs(collection(getFirestore(), `users/${this.userEmail}/veiculos`))
    if(!consulta.empty){
      consulta.forEach( doc => {
          this.veiculos[i] = {
            placa       : doc.get('placa'),
            cilindrada  : doc.get('cilindrada'),
            modelo      : doc.get('modelo'),
            marca       : doc.get('marca'),
            ano         : doc.get('ano'),
            kmAtual     : doc.get('kmAtual'),
            indice      : i,
            id          : doc.id,
          }
          i++
      })
      load.dismiss()
    }else{
      load.dismiss()
      this.actionSemVeiculos()
    }
  }

  async deletarVeiculo(idVeiculo : string){
    const load = await this.loadCtrl.create({
      message : 'Tentando excluir o veículo...'
    })
    load.present()
    await deleteDoc(doc(collection(getFirestore(), `users/${this.userEmail}/veiculos`), idVeiculo))
      .then(ok => {
        load.dismiss()
        this.toastVeiculoExcluido()
        this.navCtrl.navigateRoot('home')
      }).catch( erro => {
        load.dismiss()
        console.log(erro)
      })
  }

  async editarVeiculo(indiceVeiculo : number){
    var veiculo = this.veiculos[indiceVeiculo]
    const toastEditado = await this.toastCtrl.create({
      message : "Edição efetuada com sucesso!",
      duration: 1500,
      icon: 'checkmark-circle-outline',
    })
    const toastErro = await this.toastCtrl.create({
      message : "Não foi possivel editar o veículo",
      duration: 1500,
      icon: 'close-circle-outline'
    })
    const load = await this.loadCtrl.create({
      message : 'Tentando realizar edição...'
    })
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: `Editando ${veiculo.placa}`,
      inputs:[
        {
          name: 'novoAnoVeiculo',
          placeholder: 'Ano do veículo',
          type: 'number',
          min: 1900,
          max: 2099
        },
        {
          name: 'novaCilindradaVeiculo',
          placeholder: 'Cilindrada do veículo',
          type: 'number',
          min: 50,
        },
      ],
      buttons:[
      {
        text: 'Salvar',
        handler: (alertData)=>{
          load.present()
          if(alertData.novoAnoVeiculo != "" && alertData.novaCilindradaVeiculo != ""){
            updateDoc(doc(collection(getFirestore(), `users/${this.userEmail}/veiculos`), veiculo.id),{
              ano : alertData.novoAnoVeiculo,
              cilindrada: alertData.novaCilindradaVeiculo
            });
            load.dismiss()
            toastEditado.present()
            this.toHome()
          }else{
            load.dismiss()
            toastErro.present()
          }
          
        }
      },
      {
        text: 'Cancelar',
        role: 'cancel',
      }
      ]
    })
    alert.present()
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
          handler: () => {
            this.navCtrl.navigateForward("home")
          }
        }
      ]
    })
    await actionSheet.present()
  }

  async toastVeiculoExcluido(){
    const toast = await this.toastCtrl.create({
      message: `Veículo excluído com sucesso!`,
      duration: 1500,
      icon: 'checkmark-circle-outline',
    })
    
    await toast.present()
  }

  async alertConfExcluirVeiculo(veiculoId : string){
    const alert = await this.alertCtrl.create({
      mode: 'ios',
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

  toHome(){
    this.navCtrl.navigateForward('home')
  }

  toInfoVeiculo(veiculo : string){
    this.routerCtrl.navigateByUrl('/info-veiculo', {
      state: {idVeiculo : veiculo}
    })
  }

}
