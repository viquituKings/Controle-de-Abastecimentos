import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'cadastro-usuario',
    loadChildren: () => import('./pages/cadastro/usuario/usuario.module').then( m => m.UsuarioPageModule)
  },
  {
    path: 'cadastro-veiculos',
    loadChildren: () => import('./pages/cadastro/veiculos/veiculos.module').then( m => m.VeiculosPageModule)
  },
  {
    path: 'cadastro-abastecimentos',
    loadChildren: () => import('./pages/cadastro/abastecimentos/abastecimentos.module').then( m => m.AbastecimentosPageModule)
  },
  {
    path: 'exibir-veiculos',
    loadChildren: () => import('./pages/exibicao/veiculos/veiculos.module').then( m => m.VeiculosPageModule)
  },
  {
    path: 'exibir-abastecimentos',
    loadChildren: () => import('./pages/exibicao/abastecimentos/abastecimentos.module').then( m => m.AbastecimentosPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'exibir-usuario',
    loadChildren: () => import('./pages/exibicao/usuario/usuario.module').then( m => m.UsuarioPageModule)
  },
  {
    path: 'cadastro-manutencao-periodica',
    loadChildren: () => import('./pages/cadastro/manutencao/manutencao.module').then( m => m.ManutencaoPageModule)
  },
  {
    path: 'info-veiculo',
    loadChildren: () => import('./pages/exibicao/info-veiculo/info-veiculo.module').then( m => m.InfoVeiculoPageModule)
  },
  {
    path: 'cadastro-manutencoes',
    loadChildren: () => import('./pages/cadastro/manutencoes/manutencoes.module').then( m => m.ManutencoesPageModule)
  },
  {
    path: 'exibir-manutencoes',
    loadChildren: () => import('./pages/exibicao/manutencoes/manutencoes.module').then( m => m.ManutencoesPageModule)
  }





];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
