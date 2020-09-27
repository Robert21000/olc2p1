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




  
 Traducir(){
    try {
     this.ast = parser.parse(this.content);    
      let pila=[];
      pila.push("");
      this.salida="";
      this.servTr.PrimeraPasada(this.ast);
      this.salida=this.servTr.getResult(this.ast,pila);
      
    } catch (e) {
      console.error(e);
      return;
  }
}




Graficar(){
   this.ast = parser.parse(this.content);
   this.servTr.Graficar(this.ast);
}



Ejecutar(){
  this.consola="";
  this.servEj.Ejecucion(this.salida);
  this.consola=this.servEj.getImprimir();
  
}



  ngOnInit(){    
    
  }

}
