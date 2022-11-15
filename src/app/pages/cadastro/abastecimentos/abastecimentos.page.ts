import { collection, getFirestore, getDocs, setDoc, doc, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { MenuController, NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-abastecimentos',
  templateUrl: './abastecimentos.page.html',
  styleUrls: ['./abastecimentos.page.scss'],
})
export class AbastecimentosPage implements OnInit {

  constructor(public menuCtrl : MenuController, public navCtrl : NavController) { }

  auth = getAuth()
  email : string
  veiculos : any[]
  dataAbastecimento : string
  selectVeiculoCadAbast : number
  selectCombAbastecido : string
  checkboxTanqueCheio : boolean = false
  checkboxCombAditivado: boolean = false
  inpUltimoKmCadAbast : number
  inpKmAtualCadAbast : number
  inpQdtAbastecidaCadAbast : number
  inpValLitroCadAbast : number

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
      console.log("abastecimento cadastrado");
    }).catch(erro => {
      console.log(erro);
    })
  }

  async atualizarKmVeiculo(veiculo : string){
    await updateDoc(doc(collection(getFirestore(), `users/${this.email}/veiculos/`), veiculo), {
      ultimoKm : this.inpKmAtualCadAbast,
      kmAtual : this.inpKmAtualCadAbast,
    })
  }

  toHome(){
    //metodo para retornar à home em caso de cancelamento
    this.navCtrl.navigateForward("home")
  }
}
