/**
 * Ejemplo mi primer proyecto con Jison utilizando Nodejs en Ubuntu
 */

/* Definición Léxica */

%{

var temp=0;
%}

%lex

%options case-insensitive

%%

";"                 return 'PTCOMA';
"("                 return 'pIZQ';
")"                 return 'pDER';
"=="                return 'dbigual';
"!="                return 'dif';


"if"                return "Rif";


/* Espacios en blanco */
[ \r\t]+            {}
\n                  {}

[0-9]+("."[0-9]+)?\b    return 'entero';
[0-9]+\b                return 'decimal';

<<EOF>>                 return 'EOF';

.                       { console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column); }
/lex

/* Asociación de operadores y precedencia */

%left dbigual
%left dif
%start ini

%% /* Definición de la gramática */

ini
	: instrucciones EOF
;

instrucciones
	: instruccion instrucciones
	| instruccion
	| error { console.error('Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); }
;

instruccion: Rif pIZQ Exp pDER
{
    console.log($3.code);
}
;



Exp: Exp dbigual Exp
    {
        temp++;
        if($1.dir==$3.dir){
            let siguiente=temp+1;
            let codigo='if '+$1.dir+$2+$3.dir+" goto "+"L"+siguiente+"\n"; 
            codigo+="L"+temp+":\n";
            codigo+="L"+siguiente+":\n";
            $$={code:codigo,dir:""}
        }else{

            let siguiente=temp+1;            
            let codigo='if '+$1.dir+$2+$3.dir+" goto "+"L"+temp+":\n";
            codigo+="L"+temp+":\n";
            codigo+="L"+siguiente+":\n";
            $$={code:codigo,dir:""}
        }

    }
    |Exp dif Exp
    {
        temp++;
        if($1.dir!=$3.dir){
            let siguiente=temp+1;
            let codigo='if '+$1.dir+$2+$3.dir+" goto "+"L"+siguiente+"\n"; 
            codigo+="L"+temp+":\n";
            codigo+="L"+siguiente+":\n";
            $$={code:codigo,dir:""}
        }else{

            let siguiente=temp+1;            
            let codigo='if '+$1.dir+$2+$3.dir+" goto "+"L"+temp+":\n";
            codigo+="L"+temp+":\n";
            codigo+="L"+siguiente+":\n";
            $$={code:codigo,dir:""}
        }
    } 
    |entero 
        {
        $$={code:"",dir:Number($1)}
        }
    |decimal{
        $$={code:"",dir:Number($1)}
    };