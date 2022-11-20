import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { Component, OnInit } from '@angular/core';
import { MenuController, NavController, AlertController, ToastController } from '@ionic/angular';
import {collection, addDoc, getFirestore, getDocs} from 'firebase/firestore'

@Component({
  selector: 'app-veiculos',
  templateUrl: './veiculos.page.html',
  styleUrls: ['./veiculos.page.scss'],
})
export class VeiculosPage implements OnInit {

  constructor(public menuCtrl : MenuController, 
    public navCtrl : NavController,
    public alertCtrl : AlertController,
    public toastCtrl : ToastController) { }

  auth = getAuth()
  marcas                : any = []
  modelos               : any = []
  inpPlaca1             : string = ""
  inpPlaca2             : string = ""
  radioTipoVeiculo      : string = ""
  selectMarca           : string = ""
  selectModelo          : string = ""
  inpAnoVeiculo         : number = 0
  inpCilindradaVeiculo  : number = 0
  inpKmAtual            : number = 0
  userEmail             : string

  ngOnInit() {
    this.menuCtrl.enable(true)
    onAuthStateChanged(this.auth, (usuario) => {
      if (usuario){
        this.userEmail = usuario.email
      }
    }) 
  }

  toHome(){
    //metodo para retornar à home em caso de cancelamento do cadastro
    this.navCtrl.navigateForward("home")
  }

  async carregarMarcas(){
    this.marcas = []
    var i = 0
    const consulta = await getDocs(collection(getFirestore(), `marcas-${this.radioTipoVeiculo}s/`))
    consulta.forEach(doc => {
      this.marcas[i] = doc.data()
      i++
    })
  }

  async carregarModelos(){
    this.modelos = []
    var i = 0
    const consulta = await getDocs(collection(getFirestore(), `marcas-${this.radioTipoVeiculo}s/${this.selectMarca}/modelos`))
    consulta.forEach(doc => {
      this.modelos[i] = doc.data()
      i++
    })
    console.log(this.modelos)
  }

  async cadastrar(){
    if(this.inpPlaca1 == '' || 
      this.inpPlaca2 == '' || 
      this.radioTipoVeiculo == '' || 
      this.selectMarca == '' || 
      this.selectModelo == '' || 
      this.inpCilindradaVeiculo == 0 || 
      this.inpAnoVeiculo == 0 ){
        this.alertCamposVazios()
    }else{
      await addDoc (collection(getFirestore(),`users/${this.userEmail}/veiculos`), {
        "tipoVeiculo" : this.radioTipoVeiculo,
        "placa"       : `${this.inpPlaca1.toUpperCase()}-${this.inpPlaca2.toUpperCase()}`,
        "ano"         : this.inpAnoVeiculo,
        "marca"       : this.selectMarca,
        "modelo"      : this.selectModelo,
        "cilindrada"  : this.inpCilindradaVeiculo,
        "kmAtual"     : this.inpKmAtual,
        "ultimoKm"    : this.inpKmAtual
      }).then(ok => {
        this.toastCadastroOk()
        this.toHome()
      }).catch(erro => {
        console.log("erro")
      })
    }
  }

  async alertCamposVazios(){
    const alert = await this.alertCtrl.create({
      header: 'Ops...',
      subHeader: 'Favor, preencha todos os campos antes de continuar.',
      buttons:['Ok']
    })
    await alert.present()
  }

  async toastCadastroOk(){
    const toast = await this.toastCtrl.create({
      message: `Veículo ${this.inpPlaca1.toUpperCase()}-${this.inpPlaca2.toUpperCase()} cadastrado com sucesso!`,
      icon: 'checkmark-circle-outline',
      duration: 1500
    })
    await toast.present()
  }

}
