export class Operacion{

    operando1;
    tipoOp="";
    Operacion(a,c){
        this.operando1=a;
        this.tipoOp=c;
    }

    Operacion(a,b){

    }

    Ejecutar(){

        if(this.tipoOp=="num"){
            
            return this.operando1;
        }
        return null;
    }


}