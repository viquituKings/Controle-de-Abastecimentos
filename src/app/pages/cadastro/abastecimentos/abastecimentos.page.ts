import { collection, getFirestore, getDocs, setDoc, doc, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { MenuController, NavController, AlertController, ToastController } from '@ionic/angular';
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
    public toastCtrl : ToastController) { }

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

  ngOnInit() {
    this.menuCtrl.enable(true)
    //receber o email do usuário cadastrado
    onAuthStateChanged(this.auth, usuario => {
      this.email = usuario.email
      this.carregarVeiculos()
    })
  }

  async carregarVeiculos(){
    this.veiculos = []
    var i = 0
    const consulta = await getDocs(collection(getFirestore(), `users/${this.email}/veiculos`))
    consulta.forEach( doc => {
      this.veiculos[i] = {
        indice    : i,
        id        : doc.id,
        placa     : doc.get('placa'),
        modelo    : doc.get('modelo'),
        ultimoKm  : doc.get('kmAtual'),
      }
      console.log(this.veiculos[i])
      i++
    })
  }

  atualizarDados(){
    this.inpUltimoKmCadAbast = this.veiculos[this.selectVeiculoCadAbast].ultimoKm

  }

  async cadastrarAbastecimento(){
    if (this.dataAbastecimento == '' || 
      this.selectVeiculoCadAbast == null || 
      this.selectCombAbastecido  == '' || 
      this.inpKmAtualCadAbast == 0 ){
        this.alertCamposVazios()
      }else{
        await setDoc(doc(collection(getFirestore(), `users/${this.email}/medias`)),{
          placa : this.veiculos[this.selectVeiculoCadAbast].placa,
          kmAntigo : this.inpUltimoKmCadAbast,
          kmAtual : this.inpKmAtualCadAbast,
          qdtAbastecida : this.inpQdtAbastecidaCadAbast,
          media : (this.inpKmAtualCadAbast + this.inpUltimoKmCadAbast) / this.inpQdtAbastecidaCadAbast,
          valorLitro : this.inpValLitroCadAbast,
          combustivel : this.selectCombAbastecido,
          seTanqueCheio : this.checkboxTanqueCheio,
          seAditivado : this.checkboxCombAditivado,
          data : this.dataAbastecimento
        }).then( sucesso => {
          this.atualizarKmVeiculo(this.veiculos[this.selectVeiculoCadAbast].id);
          this.toastCadastroOk()
          this.toHome()
        }).catch(erro => {
          console.log(erro);
        })
      }
  }

  async atualizarKmVeiculo(veiculo : string){
    await updateDoc(doc(collection(getFirestore(), `users/${this.email}/veiculos/`), veiculo), {
      ultimoKm : this.inpKmAtualCadAbast,
      kmAtual : this.inpKmAtualCadAbast,
    })
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