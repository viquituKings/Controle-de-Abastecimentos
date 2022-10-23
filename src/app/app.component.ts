import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Página Inicial', url: 'home', icon: 'home' },
    { title: 'Cadastrar Veículos', url: 'cadastro-veiculos', icon: 'add-circle'},
    { title: 'Cadastrar Abastecimentos', url: 'cadastro-abastecimentos', icon: 'Color-fill'},
    { title: 'Seus Veículos', url: 'exibir-veiculos', icon: 'car'},
    { title: 'Seus Abastecimentos', url: 'exibir-abastecimentos', icon: 'cloud'},
  ];
  constructor() {}
}
