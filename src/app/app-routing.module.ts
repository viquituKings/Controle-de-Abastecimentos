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
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
