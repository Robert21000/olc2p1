import { Injectable } from '@angular/core';

import * as parser from '../../assets/1erJison/Ejecutar.js';

import { Operacion } from "../.././app/Clases/Operacion.js";
import { ParsedEvent } from '@angular/compiler';
import { SSL_OP_NO_TLSv1_2 } from 'constants';


@Injectable({
  providedIn: 'root'
})
export class EjecucionService {

  constructor() { }


ast;
listaErrores;

txtImprimir="";

tbsimbolos=[]
tbGlobal={tabla:this.tbsimbolos,padre:null};





Ejecucion(entrada:string){

try {
  this.ast=parser.parse(entrada);
  if(this.ast.nombre!="error"){

      this.Visitar(this.ast,this.tbGlobal);
  }else{

    this.listaErrores=this.ast.lista;
    for(let item of this.ast.lista){
        console.log("Error: "+item.tipo +" valor: "+item.valor+" fila: "+item.fila+" columna: "+item.columna);
    }
  }
} catch (error) {
    console.log(error);
}

}



getErrores(){

  this.listaErrores;
}





Visitar(Nodo,tbs){

    switch (Nodo.nombre){
        case "ini":
          this.Visitar(Nodo.hijos[0],tbs);
          break;
        case "instrucciones":
            if(Nodo.hijos.length==2){
              this.Visitar(Nodo.hijos[0],tbs);
              this.Visitar(Nodo.hijos[1],tbs);
            }else if(Nodo.hijos.length==1){
              this.Visitar(Nodo.hijos[0],tbs);
            }
            
          break;
      case "instruccion":
              if(Nodo.hijos[0].nombre=="DecLet"){
                this.Visitar(Nodo.hijos[0],tbs);
              }else if(Nodo.hijos[0].nombre=="DecConst"){
                this.Visitar(Nodo.hijos[0],tbs);
              }else if(Nodo.hijos[0].nombre=="id"){
                if(Nodo.hijos.length==4){

                }else if(Nodo.hijos.length==5){

                }
              }

        break;

    }

}



















getExp(Exp,tb){

    if(Exp.hijos.length==3){
          let op1=this.getExp(Exp.hijos[0],tb);
          let op2=this.getExp(Exp.hijos[2],tb);  
      switch (Exp.hijos[1].nombre) {
          case "difer":

              return {valor:op1.val!=op2.val,tip:"boolean"};
          case "dbigual":
              return {val:op1.val==op2.val,tip:"boolean"}; 
          case "mas":
              if(op1.tip=="string"||op2.tipo=="string"){
                return {val:op1.val+op2.val,tip:"string"};  
              }else{
                return {val:op1.val+op2.val,tip:"number"}
              }
          case "menos":
              if(op1.tip=="string"||op1.tip=="string"){
                this.txtImprimir+="Error Semantico no se puede restar con tipos string \n";
                return {val:0,tip:"number"};
              }else{
                return {val:op1.val-op2.val,tip:"number"};
              }
            
          case "por":
            if(op1.tip=="string"||op1.tip=="string"){
              this.txtImprimir+="Error Semantico no se puede multiplicar con tipos string \n";
              return {val:0,tip:"number"};
            }else{
              return {val:op1.val*op2.val,tip:"number"};
            }
            
          case "div":
            if(op1.tip=="string"||op1.tip=="string"){
              this.txtImprimir+="Error Semantico no se puede dividir con tipos string \n";
              return {val:0,tip:"number"};
            }else{
              if(op2.val==0){
                this.txtImprimir+="Error Semantico no se puede dividir entre 0 \n";
                return {val:0,tip:"number"};
              }else{
                return {val:op1.val/op2.val,tip:"number"};
              }
              
            }
            
          case "pot":
            if(op1.tip=="string"||op1.tip=="string"){
              this.txtImprimir+="Error Semantico no se puede hacer potencia con tipos string \n";
              return {val:0,tip:"number"};
            }else{
                return {val: Math.pow(op1.val,op2.val),tip:"number"};
            }

          case "mod":
            if(op1.tip=="string"||op1.tip=="string"){
              this.txtImprimir+="Error Semantico no se puede hacer modulo con tipos string \n";
              return {val:0,tip:"number"};
            }else{
                this.txtImprimir+="Error Semantico no se puede dividir entre 0 \n";
                return {val:op1.val%op2.val,tip:"number"};
            }  

          case "menor":
            if(op1.tip=="string"||op1.tip=="string"){
              this.txtImprimir+="Error Semantico no se puede comparar < con tipos string \n";
              return {val:false,tip:"boolean"};
            }else{
                return {val:op1.val<op2.val,tip:"boolean"};
            }

          case "mayor":
            if(op1.tip=="string"||op1.tip=="string"){
              this.txtImprimir+="Error Semantico no se puede comparar > con tipos string \n";
              return {val:false,tip:"boolean"};
            }else{
                return {val:op1.val>op2.val,tip:"boolean"};
            }
            
            case "menorq":
              if(op1.tip=="string"||op1.tip=="string"){
                this.txtImprimir+="Error Semantico no se puede comparar <= con tipos string \n";
                return {val:false,tip:"boolean"};
              }else{
                  return {val:op1.val<=op2.val,tip:"boolean"};
              }
          case "mayorq":
            if(op1.tip=="string"||op1.tip=="string"){
              this.txtImprimir+="Error Semantico no se puede comparar >= con tipos string \n";
              return {val:false,tip:"boolean"};
            }else{
                return {val:op1.val>=op2.val,tip:"boolean"};
            }
          case "or":
            if(op1.tip=="boolean"&&op1.tip=="boolean"){
              
              return {val:op1.val||op2.val,tip:"boolean"};
              
            }else{
              this.txtImprimir+="Error Semantico no se puede operar logico || con tipos que no sean boolean \n";  
              return {val:false,tip:"boolean"};
            }
          case "and":
            if(op1.tip=="boolean"&&op1.tip=="boolean"){
              
              return {val:op1.val&&op2.val,tip:"boolean"};
              
            }else{
              this.txtImprimir+="Error Semantico no se puede operar logico && con tipos que no sean boolean \n";  
              return {val:false,tip:"boolean"};
            }  

          case "Exp":
            return {val:this.getExp(Exp.hijos[1],tb).val,tip:this.getExp(Exp.hijos[1],tb).tip};
            default:
            console.log("no debio pasar por aqui");
            break;
        }

    }else if(Exp.hijos.length==2){
         let op1=this.getExp(Exp.hijos[1],tb);
      if (Exp.hijos[0].nombre=="menos"){
        if(op1.tip=="number"){
              
          return {val:op1.val*-1,tip:"number"};
          
        }else{
          this.txtImprimir+="Error Semantico no se hacer negativo si no es tipo number \n";  
          return {val:0,tip:"number"};
        }
          
      }else if(Exp.hijos[0].nombre=="neg"){
        if(op1.tip=="boolean"){
              
          return {val:!op1.val,tip:"boolean"};
          
        }else{
          this.txtImprimir+="Error Semantico no se puede negar si no es tipo boolean \n";  
          return {val:false,tip:"boolean"};
        }
        
      }

    }else if(Exp.hijos.length==1){

        if(Exp.hijos[0].nombre=="entero"){

          return {val:Number(Exp.hijos[0].valor),tip:"number"};

        }else if(Exp.hijos[0].nombre=="decimal"){
          return {val:Number(Exp.hijos[0].valor),tip:"number"};
        }else if(Exp.hijos[0].nombre=="Rfalse"){

          return {val:false,tip:"boolean"};
        }else if(Exp.hijos[0].nombre=="Rtrue"){
          return {val:true,tip:"boolean"};
        }else if(Exp.hijos[0].nombre=="cadena"){
          
          return {val:Exp.hijos[0].valor,tip:"string"};  
        }else if(Exp.hijos[0].nombre=="cadenaSimple"){
          return {val:Exp.hijos[0].valor,tip:"string"};
        }else if(Exp.hijos[0].nombre=="id"){
            
          let padre=null;
          padre=tb;
          let encontrado=false;
          let valor,tipo;
          while(padre.padre!=null){
            for(let item of padre.tabla){
                if (item.nombre==Exp.hijos[0].valor&&item.rol=="var"){
                    encontrado=true;
                    valor=item.valor;
                    tipo=item.tipo;
                }
            }

            if(encontrado){
                break;
            }
            padre=padre.padre;
          }
          
          if(encontrado){
            return  {val:valor,tip:tipo};
          }else{
            return {val:"",tip:"string"}
          }
          

        }
    }

}



}
