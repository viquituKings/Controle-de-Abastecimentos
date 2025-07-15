import { collection, getFirestore, getDocs, setDoc, doc, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { MenuController, NavController, AlertController, ToastController, LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-abastecimentos',
  templateUrl: './abastecimentos.page.html',
  styleUrls: ['./abastecimentos.page.scss'],
})
export class AbastecimentosPage implements OnInit {

  constructor(public menuCtrl : MenuController, 
    public navCtrl : NavController,
    public alertCtrl : AlertController,
    public toastCtrl : ToastController,
    public loadCtrl  : LoadingController) { }

  auth = getAuth()
  email : string
  veiculos : any[]
  dataAbastecimento : string = ''
  selectVeiculoCadAbast : number = null
  selectCombAbastecido : string = ''
  checkboxTanqueCheio : boolean = false
  checkboxCombAditivado: boolean = false
  inpUltimoKmCadAbast : number = null
  inpKmAtualCadAbast : number = null
  inpQdtAbastecidaCadAbast : number = null
  inpValLitroCadAbast : number = null
  inpUltimoCombAbast : string = ''
  inpObsCadAbast : string = ''

  ngOnInit() {
    this.menuCtrl.enable(true)
    //receber o email do usuário cadastrado
    onAuthStateChanged(this.auth, usuario => {
      this.email = usuario.email
      this.carregarVeiculos()
    })
  }

  async carregarVeiculos(){
    const load = await this.loadCtrl.create({
      message : 'Carregando seus veículos...'
    })
    load.present()
    this.veiculos = []
    var i = 0
    const consulta = await getDocs(collection(getFirestore(), `users/${this.email}/veiculos`))
    consulta.forEach( doc => {
      this.veiculos[i] = doc.data()
      this.veiculos[i].indice = i
      this.veiculos[i].id = doc.id
      console.log(this.veiculos[i])
      i++
    })
    load.dismiss()
  }

  async atualizarDados(){
    const load = await this.loadCtrl.create({
      message : 'Carregando informações do veículo...'
    })
    load.present()
    this.inpUltimoKmCadAbast = this.veiculos[this.selectVeiculoCadAbast].kmAtual
    this.inpKmAtualCadAbast = this.veiculos[this.selectVeiculoCadAbast].kmAtual
    this.inpUltimoCombAbast = this.veiculos[this.selectVeiculoCadAbast].ultimoComb
    load.dismiss()
  }

  async verificarManPeriodica(){
    if(this.veiculos[this.selectVeiculoCadAbast].cadManPeriodica != null && this.veiculos[this.selectVeiculoCadAbast].cadManPeriodica != false){
      if((this.inpKmAtualCadAbast + 1000) >= this.veiculos[this.selectVeiculoCadAbast].proxRevKm){
        const alert = await this.alertCtrl.create({
          header: 'Atenção!!!',
          subHeader: `Seu veículo ${this.veiculos[this.selectVeiculoCadAbast].placa} está próximo do período de revisão!`,
          buttons: ['ok']
        })
        alert.present()
      }
      if((this.inpKmAtualCadAbast + 500) >= this.veiculos[this.selectVeiculoCadAbast].proxTrocaOleoKm){
        const alert = await this.alertCtrl.create({
          header: 'Atenção!!!',
          subHeader: `Seu veículo ${this.veiculos[this.selectVeiculoCadAbast].placa} está próximo do período de troca de óleo!`,
          buttons: ['ok']
        })
        alert.present()
      }
    }
  }

  async cadastrarAbastecimento(){
    const load = await this.loadCtrl.create({
      message : 'Tentando cadastrar o abastecimento'
    })
    load.present()
    if (this.dataAbastecimento == '' || 
      this.selectVeiculoCadAbast == null || 
      this.selectCombAbastecido  == '' || 
      this.inpKmAtualCadAbast == 0 || 
      this.inpKmAtualCadAbast == this.veiculos[this.selectVeiculoCadAbast].kmAtual){
        load.dismiss()
        this.alertCamposVazios()
      }else{
        await setDoc(doc(collection(getFirestore(), `users/${this.email}/medias`)),{
          placa : this.veiculos[this.selectVeiculoCadAbast].placa,
          kmAntigo : this.inpUltimoKmCadAbast,
          kmAtual : this.inpKmAtualCadAbast,
          qdtAbastecida : this.inpQdtAbastecidaCadAbast,
          media : (this.inpKmAtualCadAbast - this.inpUltimoKmCadAbast) / this.inpQdtAbastecidaCadAbast,
          valorLitro : this.inpValLitroCadAbast,
          combustivel : this.selectCombAbastecido,
          combustivelAnterior : this.inpUltimoCombAbast,
          seTanqueCheio : this.checkboxTanqueCheio,
          seAditivado : this.checkboxCombAditivado,
          data : this.dataAbastecimento,
          observacao: this.inpObsCadAbast
        }).then( sucesso => {
          load.dismiss()
          this.atualizarVeiculo(this.veiculos[this.selectVeiculoCadAbast].id);
          this.verificarManPeriodica()
          this.alertAbastecido()
          this.toastCadastroOk()
          this.toHome()
        }).catch(erro => {
          load.dismiss()
          console.log(erro);
        })
      }
  }

  async alertAbastecido(){
    const alerta = await this.alertCtrl.create({
      header: 'Resumo do abastecimento:',
      message: `Combustível abastecido: ${this.selectCombAbastecido};` + '\n' +
      `media de consumo: ${(this.inpKmAtualCadAbast - this.inpUltimoKmCadAbast) / this.inpQdtAbastecidaCadAbast};` + "\n" +
      `Valor gasto: R$ ${(this.inpValLitroCadAbast * this.inpQdtAbastecidaCadAbast).toFixed(2)}`,
      buttons: [{
        text: 'Entendi',
        role: 'cancel'
      }]
    })
    alerta.present()
  }

  async atualizarVeiculo(veiculo : string){
    const load = await this.loadCtrl.create({
      message : 'Atualizando informações do veículo...'
    })
    load.present()
    await updateDoc(doc(collection(getFirestore(), `users/${this.email}/veiculos/`), veiculo), {
      ultimoKm : this.inpKmAtualCadAbast,
      kmAtual : this.inpKmAtualCadAbast,
      ultimoComb : this.selectCombAbastecido
    })
    load.dismiss()
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
      message: 'Abastecimento cadastrado com sucesso!',
      icon: 'checkmark-circle-outline',
      duration: 1500
    })
    await toast.present()
  }

  toHome(){
    //metodo para retornar à home em caso de cancelamento
    this.navCtrl.navigateForward("home")
  }
}