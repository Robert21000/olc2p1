import { Component, OnInit } from '@angular/core';
import {TraduccionService  } from "../../Servicios/traduccion.service";
import { EjecucionService } from "../../Servicios/ejecucion.service";

var parser = require('src/assets/1erJison/miGramatica.js');



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  title = 'Proyecto 1';
   content:String;
   salida:string;
   consola:string;

  constructor(private servTr:TraduccionService,private servEj:EjecucionService){

  }
  
 ast:any;



lista:any=[];
  
 Traducir(){
    try {
      
      this.ast = parser.parse(this.content);

    if(this.ast.nombre!="error"){
      this.lista=[];
      let pila=[];
      pila.push("");
      this.salida="";
      this.servTr.PrimeraPasada(this.ast);
      this.salida=this.servTr.getResult(this.ast,pila);
    }else{

      this.lista=this.ast.lista;
    } 
      
      
    } catch (e) {
      console.error(e);
      return;
  }
}




Graficar(){
   this.ast = parser.parse(this.content);
   this.servTr.Graficar(this.ast);
}

Graficar2(){
  this.ast = parser.parse(this.salida);
  this.servTr.Graficar(this.ast);
}



Ejecutar(){
  this.consola="";
  this.lista=[];
  this.servEj.Ejecucion(this.salida);
  this.consola=this.servEj.getImprimir();
  this.lista=this.servEj.getErrores();

}



  ngOnInit(){    
    
  }

}
