import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArbolComponent } from './Componentes/arbol/arbol.component';
import { AppComponent } from './app.component';
import { NuevoComponent } from './Componentes/nuevo/nuevo.component';
import { HomeComponent } from './Componentes/home/home.component';

const routes: Routes = [
  {
    path:'',
    redirectTo:'/home',
    pathMatch:'full'
  },
  {
    path:'home',
    component:HomeComponent
  },
  {
    path:'Arbol',
    component:ArbolComponent
  },
  {
    path:'nuevo',
    component:NuevoComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
