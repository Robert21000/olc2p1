import { Injectable } from '@angular/core';

import * as parser from '../../assets/1erJison/Ejecutar.js';





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
     this.txtImprimir="";
     this.tbsimbolos=[];
     this.tbGlobal={tabla:this.tbsimbolos,padre:null};
      this.RecogerFunciones(this.ast);
      let cicloG={nombre:"",valor:""};
       this.Visitar(this.ast,"","",cicloG,this.tbGlobal);
       /*for(let item of this.tbGlobal.tabla){
            console.log("nombre: "+item.nombre+" valor: "+item.valor+" tipo: "+item.tipo+" rol: "+item.rol);
            console.log(item.nodo.nombre)
            console.log(item.parametros);

       }*/
  }else{

    this.listaErrores=this.ast.lista;
    for(let item of this.ast.lista){
        console.log("Error: "+item.tipo +" valor: "+item.valor+" fila: "+item.linea+" columna: "+item.columna);
    }
  }
} catch (error) {
    console.log(error);
}

}


getImprimir(){

  return this.txtImprimir;
}


getErrores(){

  this.listaErrores;
}



RecogerFunciones(Nodo){
    switch(Nodo.nombre){
        case "ini":
          this.RecogerFunciones(Nodo.hijos[0]);
          break;
        case "instrucciones":
            if(Nodo.hijos.length==2){
                this.RecogerFunciones(Nodo.hijos[0]);
                this.RecogerFunciones(Nodo.hijos[1]);
            }else if(Nodo.hijos.length==1){
                this.RecogerFunciones(Nodo.hijos[0]);
            }
          break;
        case "instruccion":

              if(Nodo.hijos[0].nombre=="Rfunction"){
                
                if(Nodo.hijos.length==8){
                  let id=Nodo.hijos[1].valor;
                  this.RecogerFunciones(Nodo.hijos[6]);
                  let tipo=Nodo.hijos[6].valor;
                  this.RecogerFunciones(Nodo.hijos[3]);
                  
                  this.tbGlobal.tabla.push({nombre:id,tipo:tipo,valor:"",rol:"funcion",parametros:Nodo.hijos[3].parametros,valores:null,nodo:Nodo,return:""});
                  

                }else if(Nodo.hijos.length==7){
                  let id=Nodo.hijos[1].valor;
                  this.RecogerFunciones(Nodo.hijos[5]);
                  let tipo=Nodo.hijos[5].valor;
                  let parametros=[];
                  this.tbGlobal.tabla.push({nombre:id,tipo:tipo,valor:"",rol:"funcion",parametros:parametros,valores:null,nodo:Nodo,return:""});
 
                }else if(Nodo.hijos.length==6){
                  let id=Nodo.hijos[1].valor;
                  this.RecogerFunciones(Nodo.hijos[3]);
                  this.tbGlobal.tabla.push({nombre:id,tipo:"",valor:"",rol:"funcion",parametros:Nodo.hijos[3].parametros,valores:null,nodo:Nodo,return:""});

                }else if(Nodo.hijos.length==5){
                  let id=Nodo.hijos[1].valor;
                  let parametros=[];
                  this.tbGlobal.tabla.push({nombre:id,tipo:"",valor:"",rol:"funcion",parametros:parametros,valores:null,nodo:Nodo,return:""}); 
                }
                
              }
          break;

      case "Param":
              if(Nodo.hijos.length==5){
                  this.RecogerFunciones(Nodo.hijos[0]);
                  this.RecogerFunciones(Nodo.hijos[4]);
                  for(let item of Nodo.hijos[0].parametros){
                      Nodo.parametros.push(item);
                  }
                  Nodo.parametros.push({nombre:Nodo.hijos[2].valor,tipo:Nodo.hijos[4].valor});

              }else if(Nodo.hijos.length==3){
                  this.RecogerFunciones(Nodo.hijos[2]);
                  Nodo.parametros.push({nombre:Nodo.hijos[0].valor,tipo:Nodo.hijos[2].valor});
              }
        break;

        case "Ntipo":
          Nodo.valor=Nodo.hijos[0].valor;
          break;
    }

}










Visitar(Nodo,idFun,tipoFun,ciclo,tbs){

    switch (Nodo.nombre){
        case "ini":
          console.log("ini");  
          this.Visitar(Nodo.hijos[0],idFun,tipoFun,ciclo,tbs);
          
          break;
        case "instrucciones":
            if(Nodo.hijos.length==2){
              
              if(Nodo.hijos[0].hijos[0].nombre!="Rfunction"){

                
                      if(!this.TieneReturn(idFun)){


                        if(ciclo.nombre=="ciclo"&&ciclo.valor=="break"){
                          
                        }else{
                          this.Visitar(Nodo.hijos[0],idFun,tipoFun,ciclo,tbs);
                        }
                        
                      }else{
                          if(ciclo.nombre=="ciclo"&&ciclo.valor=="break"){
                            
                          }else{
                            this.Visitar(Nodo.hijos[0],idFun,tipoFun,ciclo,tbs);
                          }
                        

                      }

              }
                  if(!this.TieneReturn(idFun)){
                      if(ciclo.nombre=="ciclo"&&ciclo.valor=="break"){
                        
                      }else{
                        this.Visitar(Nodo.hijos[1],idFun,tipoFun,ciclo,tbs);
                      }
                    
                  }else{
                    if(ciclo.nombre=="ciclo"&&ciclo.valor=="break"){
                        
                    }else{
                      this.Visitar(Nodo.hijos[1],idFun,tipoFun,ciclo,tbs);
                    }

                  }
                                
              

            }else if(Nodo.hijos.length==1){
                
              if(Nodo.hijos[0].hijos[0].nombre!="Rfunction"){

                if(!this.TieneReturn(idFun)){
                  if(ciclo.nombre=="ciclo"&&ciclo.valor=="break"){

                  }else{
                    this.Visitar(Nodo.hijos[0],idFun,tipoFun,ciclo,tbs);
                  }

                }
                
              }else{
                if(ciclo.nombre=="ciclo"&&ciclo.valor=="break"){

                }else{
                  this.Visitar(Nodo.hijos[0],idFun,tipoFun,ciclo,tbs);
                }
              }
              
            }
            
          break;
      case "instruccion":
              if(Nodo.hijos[0].nombre=="DecLet"){
                this.Visitar(Nodo.hijos[0],idFun,tipoFun,ciclo,tbs);
              }else if(Nodo.hijos[0].nombre=="DecConst"){
                this.Visitar(Nodo.hijos[0],idFun,tipoFun,ciclo,tbs);
              }else if(Nodo.hijos[0].nombre=="id"){
                if(Nodo.hijos.length==4){
                   if(Nodo.hijos[1].nombre=="igual"){
                     console.log("paso en asignacion");
                        let id=Nodo.hijos[0].valor;
                        let valor=this.getExp(Nodo.hijos[2],ciclo,tbs).val;
                        let tipo=this.getExp(Nodo.hijos[2],ciclo,tbs).tip; 
                        if(this.existeId(id,tbs)){
                          this.asignarExp(id,tipo,valor,tbs);
                        }else{
                          this.txtImprimir+="Error Semantico, la variable "+id+" no existe \n";
                        }

                   }else if(Nodo.hijos[1].nombre=="pIzq"){
                      let id=Nodo.hijos[0].valor;
                      for(let item of this.tbGlobal.tabla){
                          if(id==item.nombre&&item.rol=="funcion"){
                            this.Visitar(item.nodo,idFun,tipoFun,ciclo,tbs);
                            break;
                          }
                      }

                   } 

                    
                }else if(Nodo.hijos.length==5){
                    let id= Nodo.hijos[0].valor;
                    this.Visitar(Nodo.hijos[2],idFun,tipoFun,ciclo,tbs);
                    for(let i=0; i< this.tbGlobal.tabla.length;i++){
                      if(id==this.tbGlobal.tabla[i].nombre&&this.tbGlobal.tabla[i].rol=="funcion"){
                        this.tbGlobal.tabla[i].valores=Nodo.hijos[2].valores;
                        if(this.tbGlobal.tabla[i].parametros.length==Nodo.hijos[2].valores.length){
                          let diferente=false;
                          for(let j=0;j<this.tbGlobal.tabla[i].parametros.length;j++){
                            if(this.tbGlobal.tabla[i].parametros[j].tipo!=this.tbGlobal.tabla[i].valores[j].tipo){
                                  diferente=true;
                                  break;
                            }
                          }
                          if(diferente){
                              this.txtImprimir+="Error Semantico los tipos no coinciden en la funcion "+id+" \n";
                          }else{
                              this.Visitar(this.tbGlobal.tabla[i].nodo,idFun,tipoFun,ciclo,tbs);
                          }

                        }else{

                          this.txtImprimir+="Error Semantico la funcion "+id+" No tiene el mismo numero de parametros \n";
                        }
                        
                        break;
                      }
                  }
                }
              
              }else if(Nodo.hijos[0].nombre=="Rfunction"){
                   
                    if(Nodo.hijos.length==8){
                      let tabla=[];  
                      let id=Nodo.hijos[1].valor;
                      let tbsLocal={tabla:tabla,padre:tbs};

                      this.setIniReturn(id);
                      for(let item of this.tbGlobal.tabla){
                            if(item.nombre==id){
                               for(let i=0;i<item.parametros.length;i++){
                                    let tipo=item.parametros[i].tipo;
                                    let valor=item.valores[i].valor;
                                    let idparam=item.parametros[i].nombre;
                                    this.asignarIdcnTipocnExp(idparam,tipo,valor,"let",tbsLocal);
                               } 
                              break;
                            }
                      }

                      this.Visitar(Nodo.hijos[6],id,tipoFun,ciclo,tbsLocal);
                      let tipo=Nodo.hijos[6].valor;
                      
                      this.Visitar(Nodo.hijos[7],id,tipo,ciclo,tbsLocal);

                    }else if(Nodo.hijos.length==7){
                      let tabla=[];  
                      let id=Nodo.hijos[1].valor;
                      let tbsLocal={tabla:tabla,padre:tbs};
                      this.setIniReturn(id);
                      this.Visitar(Nodo.hijos[5],id,tipoFun,ciclo,tbsLocal);
                      let tipo=Nodo.hijos[5].valor;
                      this.Visitar(Nodo.hijos[6],id,tipo,ciclo,tbsLocal);

                    }else if(Nodo.hijos.length==6){
                      let tabla=[];  
                      let id=Nodo.hijos[1].valor;
                      let tbsLocal={tabla:tabla,padre:tbs};

                      this.setIniReturn(id);
                      for(let item of this.tbGlobal.tabla){
                        if(item.nombre==id){
                           for(let i=0;i<item.parametros.length;i++){
                                let tipo=item.parametros[i].tipo;
                                let valor=item.valores[i].valor;
                                let idparam=item.parametros[i].nombre;
                                this.asignarIdcnTipocnExp(idparam,tipo,valor,"let",tbsLocal);
                           } 
                          break;
                        }
                  }
                      this.Visitar(Nodo.hijos[5],id,"",ciclo,tbsLocal); 

                    }else if(Nodo.hijos.length==5){
                   
                      let tabla=[];  
                      let id=Nodo.hijos[1].valor;
                      let tbsLocal={tabla:tabla,padre:tbs};
                      this.setIniReturn(id);
                      this.Visitar(Nodo.hijos[4],id,"",ciclo,tbsLocal);

                    }
              }else if(Nodo.hijos[0].nombre=="Rreturn"){

                if(Nodo.hijos.length==2){
                    if(idFun!=""){
                      this.setReturn(idFun);
                    }else{
                      this.txtImprimir+="Error Semantico, return solo puede venir adentro de una funcion \n";  
                    }

                }else if(Nodo.hijos.length==3){

                  if(idFun!=""){
                       
                      let val=this.getExp(Nodo.hijos[1],ciclo,tbs).val;
                      let tipo=this.getExp(Nodo.hijos[1],ciclo,tbs).tip;
                      for(let item of this.tbGlobal.tabla){
                        console.log("fucnion "+item.nombre+" rol "+item.rol+" return"+item.return);
                    }
                      this.setReturn(idFun);
                      for(let item of this.tbGlobal.tabla){
                          console.log("fucnion "+item.nombre+" rol "+item.rol+" return"+item.return);
                      }
                      this.asignarFuncion(idFun,tipoFun,val,tipo);

                     
                      
                  }else{

                    this.txtImprimir+="Error Semantico, return solo puede venir adentro de una funcion \n";     
                  }
                  

                }

              }else if(Nodo.hijos[0].nombre=="Rif"){
                  if(Nodo.hijos.length==3){

                      this.Visitar(Nodo.hijos[1],idFun,tipoFun,ciclo,tbs);
                      if(Nodo.hijos[1].res=="si"){

                            let tabla=[];
                            let tbsLocal={tabla:tabla,padre:tbs};

                            this.Visitar(Nodo.hijos[2],idFun,tipoFun,ciclo,tbsLocal);

                      }

                  }else if(Nodo.hijos.length==4){
                    
                    this.Visitar(Nodo.hijos[1],idFun,tipoFun,ciclo,tbs);
                    if(Nodo.hijos[1].res=="si"){

                          let tabla=[];
                          let tbsLocal={tabla:tabla,padre:tbs};

                          this.Visitar(Nodo.hijos[2],idFun,tipoFun,ciclo,tbsLocal);

                    }else if(Nodo.hijos[1].res=="no"){
                        this.Visitar(Nodo.hijos[3],idFun,tipoFun,ciclo,tbs);
                    }

                  }else if(Nodo.hijos.length==5){
                    this.Visitar(Nodo.hijos[1],idFun,tipoFun,ciclo,tbs);
                    if(Nodo.hijos[1].res=="si"){

                          let tabla=[];
                          let tbsLocal={tabla:tabla,padre:tbs};

                          this.Visitar(Nodo.hisjos[2],idFun,tipoFun,ciclo,tbsLocal);

                    }else if(Nodo.hijos[1].res=="no"){
                        this.Visitar(Nodo.hijos[3],idFun,tipoFun,ciclo,tbs);
                        if(Nodo.hijos[3].res=="si"){

                        }else if(Nodo.hijos[3].res=="no"){
                          this.Visitar(Nodo.hijos[4],idFun,tipoFun,ciclo,tbs);
                        }

                    }

                  }
              }else if(Nodo.hijos[0].nombre=="Rwhile"){

                    let tabla=[];
                    let tbsLocal={tabla:tabla,padre:tbs};
                
                    this.Visitar(Nodo.hijos[1],idFun,tipoFun,ciclo,tbs);
                    let miciclo={nombre:"ciclo",valor:""};
                    while(Nodo.hijos[1].res=="si"){
                      this.Visitar(Nodo.hijos[2],idFun,tipoFun,miciclo,tbsLocal);
                      this.Visitar(Nodo.hijos[1],idFun,tipoFun,ciclo,tbs); 
                    }

              }else if(Nodo.hijos[0].nombre=="Rdo"){

                let tabla=[];
                let tbsLocal={tabla:tabla,padre:tbs};
                let miciclo={nombre:"ciclo",valor:""};
                  do{
                    this.Visitar(Nodo.hijos[1],idFun,tipoFun,miciclo,tbsLocal);
                    this.Visitar(Nodo.hijos[3],idFun,tipoFun,ciclo,tbs);  
                  }while(Nodo.hijos[3].res=="si");

              }else if(Nodo.hijos[0].nombre=="Rfor"){
                    if(Nodo.hijos.length==9){
                      
                      let tabla=[];
                      let tbsLocal={tabla:tabla,padre:tbs};
                      this.Visitar(Nodo.hijos[2],idFun,tipoFun,ciclo,tbsLocal);
                        while(this.getExp(Nodo.hijos[4],ciclo,tbsLocal).val){
                          let miciclo={nombre:"ciclo",valor:""};
                          this.Visitar(Nodo.hijos[8],idFun,tipoFun,miciclo,tbsLocal);
                          this.Visitar(Nodo.hijos[6],idFun,tipoFun,ciclo,tbsLocal);
                        
                      }
                    }
                    
              }else if(Nodo.hijos[0].nombre=="Rconsole"){
                    console.log("console")
                    let valor=this.getExp(Nodo.hijos[4],ciclo,tbs).val;
                    this.txtImprimir+=valor+"\n"; 
              }else if(Nodo.hijos[0].nombre=="Aumento"){
                  this.Visitar(Nodo.hijos[0],idFun,tipoFun,ciclo,tbs);
              }else if(Nodo.hijos[0].nombre=="Decremento"){
                this.Visitar(Nodo.hijos[0],idFun,tipoFun,ciclo,tbs);
              }else if(Nodo.hijos[0].nombre=="SumaIgual"){
                this.Visitar(Nodo.hijos[0],idFun,tipoFun,ciclo,tbs);
              }else if(Nodo.hijos[0].nombre=="RestaIgual"){
                this.Visitar(Nodo.hijos[0],idFun,tipoFun,ciclo,tbs);  
              }else if(Nodo.hijos[0].nombre=="Rbreak"){
                        ciclo.valor="break";
              }else if(Nodo.hijos[0].nombre=="Rgraficar"){
                  this.txtImprimir+="-----------------------------------------------------\n"    
                  for(let item of tbs){
                      if(item.rol=="let"||item.rol=="const"){
                        if(idFun!=""){
                          this.txtImprimir+="nombre: "+item.nombre+" tipo: "+item.tipo+" rol: "+item.rol+" ambito: Local \n";
                        }else{
                          this.txtImprimir+="nombre: "+item.nombre+" tipo: "+item.tipo+" rol: "+item.rol+" ambito: Global \n";
                        }
                          
                      }else if(item.rol=="funcion"){
                        this.txtImprimir+="nombre: "+item.nombre+" tipo: "+item.tipo+" rol: "+item.rol+" param: "+item.parametros.length+" ambito: Global \n";
                      }

                  }
                  this.txtImprimir+="-----------------------------------------------------\n"     
              }else if(Nodo.hijos[0].nombre=="Rswitch"){
                  //this.txtImprimir+="paso por aqui";
                let valor=this.getExp(Nodo.hijos[2],ciclo,tbs).val;
                let tipo=this.getExp(Nodo.hijos[2],ciclo,tbs).tip;
                Nodo.hijos[5].exp.valor=valor;
                Nodo.hijos[5].exp.tipo=tipo;
                let tabla=[];
                let tbsLocal={tabla:tabla,padre:tbs};
                //let miciclo={nombre:"ciclo",valor:""};
                this.Visitar(Nodo.hijos[5],idFun,tipoFun,ciclo,tbsLocal);
                if(Nodo.hijos[5].valor=="no"){         
                  this.Visitar(Nodo.hijos[6],idFun,tipoFun,ciclo,tbsLocal);
                }

              }
              

        break;
            
      case "DecLet":
        this.Visitar(Nodo.hijos[1],idFun,tipoFun,ciclo,tbs);
        break;
      case "Lasig":
              if(Nodo.hijos.length==1){
                  this.Visitar(Nodo.hijos[0],idFun,tipoFun,ciclo,tbs);
              }else if(Nodo.hijos.length==3){
                  this.Visitar(Nodo.hijos[0],idFun,tipoFun,ciclo,tbs);
                  this.Visitar(Nodo.hijos[2],idFun,tipoFun,ciclo,tbs);
              }
        break;
      
       case "IA":
         if(Nodo.hijos.length==1){
            let id=Nodo.hijos[0].valor;
            if(!this.existeEnMiAmbito(id,tbs)){
              this.asignarId(id,"let",tbs);
            }else{

               this.txtImprimir+="Error Semantico, la variable:" +id+" ya se encuentra declarada  en este ambito \n"; 
            }
         }else if(Nodo.hijos.length==3){

              if(Nodo.hijos[1].nombre=="dosP"){
                let id=Nodo.hijos[0].valor;
                this.Visitar(Nodo.hijos[2],idFun,tipoFun,ciclo,tbs);
                let tipo=Nodo.hijos[2].valor;
                 if(!this.existeEnMiAmbito(id,tbs)){
                    this.asignarIdcnTipo(id,tipo,"let",tbs);
                 }else{
    
                  this.txtImprimir+="Error Semantico, la variable:" +id+" ya se encuentra declarada en este ambito \n";
                 }
              }else if(Nodo.hijos[1].nombre=="igual"){
                 let id = Nodo.hijos[0].valor;
                 let val=this.getExp(Nodo.hijos[2],ciclo,tbs).val;
                 let tipo=this.getExp(Nodo.hijos[2],ciclo,tbs).tip;
                 //console.log("id "+id+" val: "+val+" tipo: "+tipo);
                if(!this.existeEnMiAmbito(id,tbs)){
                  this.asignarIdcnTipocnExp(id,tipo,val,"let",tbs);
                }else{

                  this.txtImprimir+="Error Semantico, la variable:" +id+" ya se encuentra declarada en este ambito \n";
                }
                
              }
            
         }else if(Nodo.hijos.length==5){
            let id=Nodo.hijos[0].valor;
            this.Visitar(Nodo.hijos[2],idFun,tipoFun,ciclo,tbs);
            let tipo=Nodo.hijos[2].valor;
            let valor=this.getExp(Nodo.hijos[4],ciclo,tbs).val;
            let otrotipo=this.getExp(Nodo.hijos[4],ciclo,tbs).tip;

            if(!this.existeEnMiAmbito(id,tbs)){
              if(otrotipo==tipo){
                this.asignarIdcnTipocnExp(id,tipo,valor,"let",tbs);
              }else{
                this.txtImprimir+="Error Semantico, se le quiere aisgnar tipos diferentes: "+otrotipo+" con "+tipo+" \n";  
                this.asignarIdcnTipocnExp(id,otrotipo,valor,"let",tbs);
              }
              
            }else{

              this.txtImprimir+="Error Semantico, la variable:" +id+" ya se encuentra declarada en este ambito \n";
            }

         }

         break;
    case "Ntipo":
          Nodo.valor=Nodo.hijos[0].valor;
      break;

    case "DecConst":
         this.Visitar(Nodo.hijos[1],idFun,tipoFun,ciclo,tbs);
      break;

    case "Lconst":
          if(Nodo.hijos.length==1){
              this.Visitar(Nodo.hijos[0],idFun,tipoFun,ciclo,tbs);
              this.Visitar(Nodo.hijos[2],idFun,tipoFun,ciclo,tbs);
          }else if(Nodo.hijos.length==3){
              this.Visitar(Nodo.hijos[0],idFun,tipoFun,ciclo,tbs);
          }
      break;

    case "CA":
      if(Nodo.hijos.length==3){
        let id=Nodo.hijos[0].valor;
        let tipo=this.getExp(Nodo.hijos[2],ciclo,tbs).tip;
        let valor=this.getExp(Nodo.hijos[2],ciclo,tbs).val;
        if(!this.existeEnMiAmbito(id,tbs)){
          this.asignarIdcnTipocnExp(id,tipo,valor,"const",tbs);
        }else{
          this.txtImprimir+="Error Semantico, la constante:" +id+" ya se encuentra declarada en este ambito \n";
        }
        


      }else if(Nodo.hijos.length==5){
        let id=Nodo.hijos[0].valor;
        this.Visitar(Nodo.hijos[2],idFun,tipoFun,ciclo,tbs);
        let tipo=Nodo.hijos[2].valor
        let valor=this.getExp(Nodo.hijos[4],ciclo,tbs).val;
        let otrotipo=this.getExp(Nodo.hijos[4],ciclo,tbs).tip;
        if(!this.existeEnMiAmbito(id,tbs)){

          if(otrotipo==tipo){
            this.asignarIdcnTipocnExp(id,tipo,valor,"const",tbs);
          }else{
            this.txtImprimir+="Error Semantico, se le quiere aisgnar tipos diferentes: "+otrotipo+" con "+tipo+" \n";
            this.asignarIdcnTipocnExp(id,otrotipo,valor,"const",tbs);
          }
        }else{
          this.txtImprimir+="Error Semantico, la constante:" +id+" ya se encuentra declarada en este ambito \n";
        }  

      }
        
      break;
    
    case "Param":
          if(Nodo.hijos.length==5){
              this.Visitar(Nodo.hijos[0],idFun,tipoFun,ciclo,tbs);
              let id=Nodo.hijos[2].valor;
              this.Visitar(Nodo.hijos[4],idFun,tipoFun,ciclo,tbs);
              let tipo=Nodo.hijos[4].valor;
              this.asignarIdcnTipo(id,tipo,"let",tbs);
          }else if(Nodo.hijos.length==3){
            let id=Nodo.hijos[0].valor;
            this.Visitar(Nodo.hijos[2],idFun,tipoFun,ciclo,tbs);
            let tipo=Nodo.hijos[2].valor;
            this.asignarIdcnTipo(id,tipo,"let",tbs); 
          }
      break;
    
    case "BloqueIns":
          if(Nodo.hijos.length==3){
              this.Visitar(Nodo.hijos[1],idFun,tipoFun,ciclo,tbs);
          }
      break;
    
    case "Condicion":
          
          let tipo=this.getExp(Nodo.hijos[1],ciclo,tbs).tip;
          if(tipo=="boolean"){
              
              if(this.getExp(Nodo.hijos[1],ciclo,tbs).val){
                  Nodo.res="si";
              }else{
                  Nodo.res="no";
              }

          }else{
              Nodo.res="no";
              this.txtImprimir+="Error Semantico, las exp en if deben ser booleanas \n";
          }

      break;
    case "NelseIf":
          if(Nodo.hijos.length==4){

              this.Visitar(Nodo.hijos[2],idFun,tipoFun,ciclo,tbs);
              if(Nodo.hijos[2].res=="si"){
                    let tabla=[];
                    let tbsLocal={tabla:tabla,padre:tbs};  
                    this.Visitar(Nodo.hijos[3],idFun,tipoFun,ciclo,tbsLocal);
                    Nodo.res="si";
                  
              }else{
                Nodo.res="no";
              }


          }else if(Nodo.hijos.length==5){

            this.Visitar(Nodo.hijos[0],idFun,tipoFun,ciclo,tbs);

            if(Nodo.hijos[0].res=="si"){
                Nodo.res="si";
            }else if(Nodo.hijos[0].res=="no"){

              this.Visitar(Nodo.hijos[3],idFun,tipoFun,ciclo,tbs);
                  if(Nodo.hijos[3].res=="si"){
                       
                      let tabla=[];
                      let tbsLocal={tabla:tabla,padre:tbs};
                      this.Visitar(Nodo.hijos[4],idFun,tipoFun,ciclo,tbsLocal);
                      Nodo.res="si";
                  }else{
                      Nodo.res="no";
                  }

            }

          }
      break;


    case "Nelse":
      let tabla=[];
      let tbsLocal={tabla:tabla,padre:tbs};
      this.Visitar(Nodo.hijos[1],idFun,tipoFun,ciclo,tbsLocal);
      break;


    case "AsignaFor":
          
            if(Nodo.hijos.length==3){
                let id =Nodo.hijos[0].valor;
                let valor= this.getExp(Nodo.hijos[2],ciclo,tbs).val;
                let tipo= this.getExp(Nodo.hijos[2],ciclo,tbs).tip;
                if(this.existeId(id,tbs)){
                  this.asignarExp(id,tipo,valor,tbs);
                }else{
                  this.txtImprimir+="Error Semantico, la variable "+id+" no existe \n";
                }
                

            }else if(Nodo.hijos.length==4){

              let id=Nodo.hijos[1].valor;
              let valor=this.getExp(Nodo.hijos[3],ciclo,tbs).val;
              let tipo=this.getExp(Nodo.hijos[3],ciclo,tbs).tip;
              if(!this.existeEnMiAmbito(id,tbs)){
                  this.asignarIdcnTipocnExp(id,tipo,valor,"let",tbs);
              }else{
                this.txtImprimir+="Error Semantico, la variable:" +id+" ya se encuentra declarada en este ambito \n";
              }

            }else if(Nodo.hijos.length==6){
              let id=Nodo.hijos[1].valor;
              this.Visitar(Nodo.hijos[3],idFun,tipoFun,ciclo,tbs);
              let tipo=Nodo.hijos[3].valor;
              let valor=this.getExp(Nodo.hijos[5],ciclo,tbs).val;
              if(!this.existeEnMiAmbito(id,tbs)){
                this.asignarIdcnTipocnExp(id,tipo,valor,"let",tbs);
              }else{
                this.txtImprimir+="Error Semantico, la variable:" +id+" ya se encuentra declarada en este ambito \n";
              }
              
            }

      break;

      case "insfor":
            if(Nodo.hijos.length==1){
                this.Visitar(Nodo.hijos[0],idFun,tipoFun,ciclo,tbs);
            }else if(Nodo.hijos.length==3){
                let id=Nodo.hijos[0].valor;
                let tipo=this.getExp(Nodo.hijos[2],ciclo,tbs).tip;
                let valor=this.getExp(Nodo.hijos[2],ciclo,tbs).val;
                if(this.existeId(id,tbs)){
                  this.asignarExp(id,tipo,valor,tbs);
                }else{
                  this.txtImprimir+="Error Semantico, la variable "+id+" no existe \n";  
                }
                
            }
        break;

     case "Aumento":
            let id=Nodo.hijos[0].valor;
            console.log("id en aumento es: "+id);
            if(this.existeId(id,tbs)){
              this.Aumentar(id,tbs);
            }else{
              this.txtImprimir+="Error Semantico, la variable "+id+" para aumento no existe \n";  
            }
            
       break;
      case "Decremento":
          let id2=Nodo.hijos[0].valor;
          if(this.existeId(id2,tbs)){
            this.Disminuir(id2,tbs);
          }else{
            this.txtImprimir+="Error Semantico, la variable "+id2+" para decremento no existe \n";
          }
          
        break;
      case "SumaIgual":
            let id3=Nodo.hijos[0].valor;
            let valor=this.getExp(Nodo.hijos[3],ciclo,tbs).val;
            if(this.existeId(id3,tbs)){
              this.SumarIgual(id3,valor,tbs);
            }else{
              this.txtImprimir+="Error Semantico, la variable "+id3+" para suma Igual no existe \n";
            }
            
        break;
      case "RestaIgual":
            let id4=Nodo.hijos[0].valor;
            let valor2=this.getExp(Nodo.hijos[3],ciclo,tbs).val;
            let tipo2=this.getExp(Nodo.hijos[3],ciclo,tbs).tip;
            if(this.existeId(id4,tbs)){
                this.RestaIgual(id4,tipo2,valor2,tbs);
            }else{
              this.txtImprimir+="Error Semantico, la variable "+id4+" para resta igual no existe \n";
            }

        break;
      
       case "Lparam":
         if(Nodo.hijos.length==3){
         // console.log("paso Lparam 3");
         Nodo.valores=[];
          this.Visitar(Nodo.hijos[0],idFun,tipoFun,ciclo,tbs);  
          for(let item of Nodo.hijos[0].valores){
              Nodo.valores.push(item);
            }
          Nodo.valores.push({valor:this.getExp(Nodo.hijos[2],ciclo,tbs).val,tipo:this.getExp(Nodo.hijos[2],ciclo,tbs).tip});  
          
         }else if(Nodo.hijos.length==1){
           Nodo.valores=[];
          Nodo.valores.push({valor:this.getExp(Nodo.hijos[0],ciclo,tbs).val,tipo:this.getExp(Nodo.hijos[0],ciclo,tbs).tip});
          }
         break; 
        case "Ncase":
              if(Nodo.hijos.length==5){
                //this.txtImprimir+="paso por aqui ncase 5";
                Nodo.hijos[0].exp.valor=Nodo.exp.valor;
                Nodo.hijos[0].exp.tipo=Nodo.exp.tipo;
                this.Visitar(Nodo.hijos[0],idFun,tipoFun,ciclo,tbs);
                if(Nodo.hijos[0].valor=="no"){
                    let valor=this.getExp(Nodo.hijos[2],ciclo,tbs).val;
                    let tipo=this.getExp(Nodo.hijos[2],ciclo,tbs).tip;
                      
                  if(valor==Nodo.exp.valor){
                      Nodo.valor="si";
                      this.Visitar(Nodo.hijos[4],idFun,tipoFun,ciclo,tbs);
                  }else{
                    Nodo.valor="no";    
                  }
                }else{
                  Nodo.valor="si";
                }
              }else if(Nodo.hijos.length==4){
               // this.txtImprimir+="paso por aqui ncase 4";
                this.Visitar(Nodo.hijos[0],idFun,tipoFun,ciclo,tbs);
                let valor=this.getExp(Nodo.hijos[1],ciclo,tbs).val;
                let tipo=this.getExp(Nodo.hijos[1],ciclo,tbs).tip;
                //console.log("4valor: "+valor+" exp.valor: "+Nodo.exp.valor);  
                  if(valor==Nodo.exp.valor){
                      Nodo.valor="si";
                      this.Visitar(Nodo.hijos[3],idFun,tipoFun,ciclo,tbs);
                  }else{
                    Nodo.valor="no";    
                  }
                

              }

          break;

          case "Ndefault":
                  this.Visitar(Nodo.hijos[2],idFun,tipoFun,ciclo,tbs);
            break;
    }

}




existeId(id,tbs){
let existe=false;
let padre=null;
padre=tbs;
  while(padre!=null){
    for(let item of padre.tabla){
      if(item.nombre==id&&item.rol=="let"){
          existe=true;
      }
  }
    if(existe){
        break;
    }
    padre=padre.padre;
  }


return existe;
}

existeEnMiAmbito(id,tbs){
  let existe=false;
      for(let item of tbs.tabla){
        if(item.nombre==id&&(item.rol=="let"||item.rol=="const")){
            existe=true;
        }
    }
     
  return existe;
  }




asignarId(id,rol,tbs){

tbs.tabla.push({nombre:id,tipo:"",valor:"",rol:rol});

}

asignarIdcnTipo(id,tipo,rol,tbs){

  tbs.tabla.push({nombre:id,tipo:tipo,valor:"",rol:rol});
  
}


 asignarIdcnTipocnExp(id,tipo,valor,rol,tbs){
  
  tbs.tabla.push({nombre:id,tipo:tipo,valor:valor,rol:rol});
  
 }

Aumentar(id,tbs){
 
    let padre=null;
    padre=tbs;
    let encontrado=false;
    while(padre!=null){
        for(let i=0; i< padre.tabla.length;i++){
            if(id==padre.tabla[i].nombre&&padre.tabla[i].tipo=="number"){
              
                padre.tabla[i].valor+=1;
                encontrado=true;
            }
        }

        if(encontrado){
            break;
        }

        padre=padre.padre;
    }

}

Disminuir(id,tbs){
  let padre=null;
  padre=tbs;
  let encontrado=false;
  while(padre!=null){
      for(let i=0; i< padre.tabla.length;i++){
          if(id==padre.tabla[i].nombre&&padre.tabla[i].tipo=="number"){
              padre.tabla[i].valor-=1;
              encontrado=true;
          }
      }

      if(encontrado){
          break;
      }

      padre=padre.padre;
  }

}



SumarIgual(id,valor,tbs){
    let padre=null;
    padre=tbs;
    let encontrado=false;
    while(padre!=null){
        for(let i=0; i< padre.tabla.length;i++){
            if(id==padre.tabla[i].nombre){
                padre.tabla[i].valor+=valor;
                encontrado=true;
            }
        }

        if(encontrado){
            break;
        }

        padre=padre.padre;
    }
}

RestaIgual(id,tipo,valor,tbs){
  let padre=null;
  padre=tbs;
  let encontrado=false;
  if(tipo=="number"){
    while(padre!=null){
        for(let i=0; i< padre.tabla.length;i++){
            if(id==padre.tabla[i].nombre&&padre.tabla[i].tipo=="number"){
                padre.tabla[i].valor-=valor;
                encontrado=true;
            }
        }

        if(encontrado){
            break;
        }

        padre=padre.padre;
    }
  }else{
    this.txtImprimir+="Error Semantico, el decremento necesita ser tipo number \n";
  }


}


 asignarExp(id,tipo,valor,tbs){

      let padre=null;
      padre=tbs;
      let encontrado=false;
      while(padre!=null){
          for(let i=0; i< padre.tabla.length;i++){
                if(padre.tabla[i].nombre==id&&padre.tabla[i].rol=="let"){
                  encontrado=true;
                    if(tipo==padre.tabla[i].tipo||padre.tabla[i].tipo==""){
                        padre.tabla[i].valor=valor;
                        padre.tabla[i].tipo=tipo;
                    }else{
                      this.txtImprimir+="Error Semantico, no se puede asignar un tipo diferente al que ya tiene \n";    
                    }
                }else if(padre.tabla[i].nombre==id&&padre.tabla[i].rol=="const"){
                  encontrado=true;
                  this.txtImprimir+="Error Semantico, la constante:" +id+" no se puede modificar \n";
                }
          }

          if(encontrado){
            break;
          }
        padre=padre.padre;
      }


  }


asignarFuncion(idf,tipof,valor,tipo){
         
      for(let i=0;i<this.tbGlobal.tabla.length;i++){
          if(this.tbGlobal.tabla[i].nombre==idf&&this.tbGlobal.tabla[i].rol=="funcion"){
            if(tipof!=""){
              if(tipof==tipo){
                this.tbGlobal.tabla[i].valor=valor;
                break;
              }else{
                this.txtImprimir+="Error Semantico Tipo Retornado diferente al tipo funcion "+idf+" \n";
                if(tipof=="string"){
                  this.tbGlobal.tabla[i].valor="";
                }else if(tipof=="boolean"){
                  this.tbGlobal.tabla[i].valor=false;   
                }else if(tipof=="number"){
                  this.tbGlobal.tabla[i].valor=0;
                }
                break; 
              }  
            }else{
              this.tbGlobal.tabla[i].valor=valor;
              this.tbGlobal.tabla[i].tipo=tipo;
              break;
            }
            
      }
    }


}





getExp(Exp,ciclo,tb){

    if(Exp.hijos.length==5){
      let condicion=this.getExp(Exp.hijos[0],ciclo,tb);
      if(condicion.tip=="boolean"){
          if(condicion.val){
            let op1=this.getExp(Exp.hijos[2],ciclo,tb);
            return {val:op1.val,tip:op1.val};
          }else{
            let op2=this.getExp(Exp.hijos[4],ciclo,tb);

            return {val:op2.val,tip:op2.tip};
          }
      }else{
        this.txtImprimir+="Error semantico antes de ternario ? debe ser tipo booleano \n";
      }

    }else if(Exp.hijos.length==4){
      let id= Exp.hijos[0].valor;
      this.Visitar(Exp.hijos[2],"","",ciclo,tb);
      
      for(let i=0; i< this.tbGlobal.tabla.length;i++){
        if(id==this.tbGlobal.tabla[i].nombre&&this.tbGlobal.tabla[i].rol=="funcion"){
          this.tbGlobal.tabla[i].valores=Exp.hijos[2].valores;
          //console.log("parametros: "+this.tbGlobal.tabla[i].parametros.length);
          //console.log("valores: "+Exp.hijos[2].valores.length);

          if(this.tbGlobal.tabla[i].parametros.length==Exp.hijos[2].valores.length){
            let diferente=false;
            for(let j=0;j<this.tbGlobal.tabla[i].parametros.length;j++){
              if(this.tbGlobal.tabla[i].parametros[j].tipo!=this.tbGlobal.tabla[i].valores[j].tipo){
                    diferente=true;
                    break;
              }
            }
            if(diferente){
                this.txtImprimir+="Error Semantico los tipos no coinciden en la funcion "+id+" \n";
            }else{
                this.Visitar(this.tbGlobal.tabla[i].nodo,"","",ciclo,tb);
                let valor="";
                let tipo="string";
                for(let item of this.tbGlobal.tabla){
                    if(item.nombre==id&&item.rol=="funcion"){
                        valor=item.valor;
                        tipo=item.tipo;
                        break;
                    }
                }
                return {val:valor,tip:tipo};
            }

          }else{

            this.txtImprimir+="Error Semantico la funcion "+id+" No tiene el mismo numero de parametros \n";
          }
          
          break;
        }
    } 
     return {val:"",tip:"string"};

    }else if(Exp.hijos.length==3){
      let op1;
      let op2;
          if(Exp.hijos[1].nombre!="Exp"&&Exp.hijos[1].nombre!="pIzq"){
            op1=this.getExp(Exp.hijos[0],ciclo,tb);
            op2=this.getExp(Exp.hijos[2],ciclo,tb);
          }  
            
      switch (Exp.hijos[1].nombre) {
          case "difer":

              return {valor:op1.val!=op2.val,tip:"boolean"};
          case "dbigual":
              return {val:op1.val==op2.val,tip:"boolean"}; 
          case "mas":
              if(op1.tip=="string"||op2.tip=="string"){
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
            console.log("paso menor");
            if(op1.tip=="string"||op1.tip=="string"){
              this.txtImprimir+="Error Semantico no se puede comparar < con tipos string \n";
              return {val:false,tip:"boolean"};
            }else{
                return {val:op1.val<op2.val,tip:"boolean"};
            }

          case "mayor":
            console.log(" op1.tip: "+op1.tip);
            console.log(" op2.tip: "+op2.tip);
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
            console.log("paso exp parentesis");
            return this.getExp(Exp.hijos[1],ciclo,tb);
            
          case "pIzq":
            let id=Exp.hijos[0].valor;
            for(let item of this.tbGlobal.tabla){
                if(id==item.nombre&&item.rol=="funcion"){
                  this.Visitar(item.nodo,"","",ciclo,tb);
                  break;
                }
            }
            let valor="";
            let tipo="string";
            for(let i=0;i<this.tbGlobal.tabla.length;i++){
                  if(id==this.tbGlobal.tabla[i].nombre&&this.tbGlobal.tabla[i].rol=="funcion"){
                      valor=this.tbGlobal.tabla[i].valor;
                      tipo=this.tbGlobal.tabla[i].tipo;
                    break;
                  }
            }
            return {val:valor,tip:tipo};

          default:
            console.log("no debio pasar por aqui Exp");
            break; 
        }

    }else if(Exp.hijos.length==2){
          console.log("paso neg");
         let op1=this.getExp(Exp.hijos[1],ciclo,tb);
      if (Exp.hijos[0].nombre=="menos"){
        if(op1.tip=="number"){
              
          return {val:op1.val*-1,tip:"number"};
          
        }else{
          this.txtImprimir+="Error Semantico no se hacer negativo si no es tipo number \n";  
          return {val:0,tip:"number"};
        }
          
      }else if(Exp.hijos[0].nombre=="neg"){
        console.log("neg 2");
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
          while(padre!=null){
            for(let item of padre.tabla){

                if (item.nombre==Exp.hijos[0].valor&&(item.rol=="let"||item.rol=="const")){
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




setIniReturn(id){
  for(let i=0;i<this.tbGlobal.tabla.length;i++){
      if(this.tbGlobal.tabla[i].nombre==id&&this.tbGlobal.tabla[i].rol=="funcion"){
              this.tbGlobal.tabla[i].return="";
      }
  }
}

setReturn(id){
  for(let i=0;i<this.tbGlobal.tabla.length;i++){
      if(this.tbGlobal.tabla[i].nombre==id&&this.tbGlobal.tabla[i].rol=="funcion"){
              this.tbGlobal.tabla[i].return="return";
      }
  }
}

TieneReturn(id){
   let esta=false;
   for(let i=0;i<this.tbGlobal.tabla.length;i++){
    if(this.tbGlobal.tabla[i].nombre==id&&this.tbGlobal.tabla[i].rol=="funcion"){
          
            if(this.tbGlobal.tabla[i].return=="return"){
                esta=true;
                break;
            }
    }
    
} 
return esta;
}





}
