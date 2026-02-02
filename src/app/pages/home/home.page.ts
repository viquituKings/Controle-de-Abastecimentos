import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, MenuController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    public menuCtrl : MenuController, 
    public navCtrl : NavController,
    public alertCtrl : AlertController,
    public loadCtrl : LoadingController) { }

    valEtanol : string = ""
    valGasolina : string = ""

  ngOnInit() {
    this.menuCtrl.enable(true)
  }

  toCadVeiculo(){
    this.navCtrl.navigateForward('cadastro-veiculos');
  }

  toCadAbastecimento(){
    this.navCtrl.navigateForward('cadastro-abastecimentos');
  }
  toCadManutencao(){
    this.navCtrl.navigateForward('cadastro-manutencoes');
  }

  toMeusVeiculos(){
    this.navCtrl.navigateForward('exibir-veiculos');
  }

  toMeusAbastecimentos(){
    this.navCtrl.navigateForward('exibir-abastecimentos');
  }

  async calcularEquivalencia(){
    const load = await this.loadCtrl.create({
      message: "Calculando...",
    })
    load.present()
    const etanol = parseFloat(this.valEtanol.replace("," , "."))
    const gasolina = parseFloat(this.valGasolina.replace("," , "."))

    const calculo = (etanol*100)/gasolina

    var mensagem = ""
    if (calculo <= 70){
      mensagem = `O valor do etanol equivale a ${calculo.toFixed(0)}% do valor da gasolina, vale a pena realizar o abastecimento com etanol`
    } else {
      mensagem = `O valor do etanol equivale a ${calculo.toFixed(0)}% do valor da gasolina, é melhor abastecer com gasolina`
    }


    const alert = await this.alertCtrl.create({
      mode: "ios",
      header: "Resultado",
      message: mensagem,
      buttons: [
        {
          text: "Ok",
          role: "cancel"
        }
      ]
    })
    load.dismiss()
    alert.present()
  }

}
