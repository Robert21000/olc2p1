/**
 * Ejemplo mi primer proyecto con Jison utilizando Nodejs en Ubuntu
 */

/* Definición Léxica */
/*
function imprimir(nombre){
    console.log(nombre);
}*/
%{

var listaErrores=[];
var idg=0;

%}

%lex


%options case-sensitive

%x string
%%



\s+								// se ignoran espacios en blanco
[ \r\t]+            {}
\n                  {}
"//".*										// comentario simple línea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]			// comentario multiple líneas

//[^"`"]* 							return 'todo';

";"                 return 'ptycoma';
":"					return 'dosP';
"=="				return 'dbigual';
"**"                return 'pot';
"="					return 'igual';
"."					return 'punto';
","					return 'coma';
"("                 return 'pIzq';
")"                 return 'pDer';
"["                 return 'cIzq';
"]"                 return 'cDer';
"{"					return 'llIzq';
"}"					return 'llDer';
"+"                 return 'mas';
"-"                 return 'menos';
"*"                 return 'por';
"/"                 return 'div';
"%"					return 'mod';
"<="				return 'menorq';
">="				return 'mayorq';
"<"					return 'menor';
">"					return 'mayor';
"`"					return 'agudo';



"?"					return 'ternario';

"$"					return 'dolar';

"!="				return 'difer';
"!"					return 'neg';
"||"				return 'or';
"&&"				return 'and';


"null"				return 'Rnull';
"break"				return 'Rbreak';
"return"			return 'Rreturn';
"if"				return 'Rif';
"else"				return 'Relse';
"for"				return 'Rfor';
"of"				return 'Rof';
"in"				return 'Rin';
"while"				return 'Rwhile';
"do"				return 'Rdo';
"continue"			return 'Rcontinue';
"function"			return 'Rfunction';
"string"			return 'Rstring';
"boolean"			return 'Rboolean';
"number"			return 'Rnumber';
"type"				return 'Rtype';
"void"				return 'Rvoid';
"true"				return 'Rtrue';
"false"				return 'Rfalse';
"default"			return 'Rdefault';
"switch"			return 'Rswitch';
"case"				return 'Rcase';
"Array"				return 'Rarray';
"let"				return 'Rlet';
"const"				return 'Rconst';
"console"			return 'Rconsole';
"log"				return 'Rlog';
'push'				return 'Rpush';
'pop'				return 'Rpop';
'length'			return 'Rlength';

/* Espacios en blanco */

[0-9]+\b                				return 'entero';
[0-9]+("."[0-9]+)?\b    				return 'decimal';


[a-zA-Z]+("_"|[a-zA-AZ]|[0-9])*\b 		return 'id';

\"([^\"]|"\n"|"\t"|"\r")*\"				return 'cadena';

\'[^\']*\'								return 'cadenaSimple';



<<EOF>>								return 'EOF';

.                       { 
	//console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column); 
	listaErrores.push({tipo:'Error Léxico',valor:yytext,linea:yylloc.first_line,columna:yylloc.first_column});
	return listaErrores;
	}
/lex

/* Asociación de operadores y precedencia */







%left 'Relse'
%left 'or'
%left 'and'
%left ternario
%left 'difer' ,'dbigual'
%left 'menor' ,'mayor' ,'menorq' ,'mayorq' 

%left 'mas', 'menos'
%left 'por', 'div' ,'mod'
%left 'pot'
%right 'neg'
%left UMENOS







%start ini

%% /* Definición de la gramática */

ini: instrucciones EOF 	
;

instrucciones: instrucciones instruccion
|instruccion
	| error { 
		//console.error('Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column);
		listaErrores.push({tipo:'Error Sintáctico ',valor:yytext,linea:this._$.first_line,columna:this._$.first_column});
		return listaErrores;
		 }
	;	




instruccion:
		Rlet id dosP Ntipo Arr igual Exp ptycoma						// Dec let arreglo tipo As
		|Rlet id dosP Ntipo Arr ptycoma									// Dec let arreglo tipo
		|Rlet id dosP Ntipo igual Exp ptycoma							// Dec let tipo As
		|Rlet id igual Exp ptycoma										// Dec let sin tipo As
		|Rlet id ptycoma												// Dec let
		|Rlet id dosP Ntipo	ptycoma										// Dec let tipo
 		|Rconst id dosP Ntipo Arr igual Exp ptycoma 					// Dec const con Asignacion
		|Rconst id dosP Ntipo igual Exp ptycoma 						// Dec const con tipo
		|Rconst id igual Exp ptycoma 									// Dec const
		|id igual Exp ptycoma											//id asignacion
		|Objeto igual Exp ptycoma										//Obj asignacion
		|id punto Rpop pIzq pDer ptycoma								//id pop()
		|Objeto punto Rpop pIzq pDer ptycoma							//objeto pop()
		|id punto Rpush pIzq Exp pDer ptycoma
		|Objeto punto Rpush pIzq Exp pDer ptycoma						// objeto push(exp)
		|Rtype id igual llIzq Decl llDer 								//type
		|Rfunction id pIzq Param pDer dosP Ntipo BloqueIns				//funciones
		|Rfunction id pIzq pDer dosP Ntipo BloqueIns					//funciones sin param
		|Rfunction id pIzq Param pDer BloqueIns							//funciones sin tipo
		|Rfunction id pIzq pDer BloqueIns								//funciones sin tipo y sin param
		|Rreturn ptycoma												// return 
		|Rreturn Exp ptycoma											//return exp
		|Rbreak ptycoma													//break
		|Rcontinue ptycoma												//continue
		|Rif Condicion BloqueIns 										//if
		|Rif Condicion BloqueIns NelseIf 								//if elseif
		|Rif Condicion BloqueIns  Nelse 								//if else
		|Rif Condicion BloqueIns NelseIf Nelse 							//if elseif else
		|Rswitch pIzq Exp pDer llIzq Ncase Ndefault llDer				//switch
		|Rwhile Condicion BloqueIns										//while
		|Rdo BloqueIns Rwhile Condicion ptycoma							//do while
		|Rfor pIzq AsignaFor ptycoma Exp ptycoma insfor pDer BloqueIns	//for
		|Rfor pIzq Rlet id Rof id pDer BloqueIns						//for of
		|Rfor pIzq Rlet id Rin id pDer BloqueIns						// for in
		|Rconsole punto Rlog pIzq Exp pDer ptycoma						//imprimir num
		|Aumento	ptycoma												//id++
		|Decremento ptycoma												//id--
		|SumaIgual ptycoma												//id+=
		|id pIzq pDer ptycoma											//llamada funcion sin param
		|id pIzq Lparam pDer ptycoma									//llamada funcion con param
		|id pIzq pDer punto Rlength	ptycoma								// llamada a length funcion
		|id pIzq Lparam pDer punto Rlength ptycoma						//llamada a length funcion param			
		|RestaIgual ptycoma												//id-=
		;


Objeto:Objeto punto id
|id punto id
	;

BloqueIns: 
		llIzq instrucciones llDer
		|llIzq llDer
		;



Asigna: 
	 Rlet id dosP Ntipo igual Exp
	 ;


AsignaFor: Rlet id dosP Ntipo igual Exp
|Rlet id igual Exp
|id igual Exp
;

NelseIf:
	NelseIf Relse Rif Condicion BloqueIns
	|Relse Rif Condicion BloqueIns
	;


Condicion:
	pIzq Exp pDer
	;

Nelse:
	Relse BloqueIns
	;

Ncase:
	Ncase Rcase Exp dosP instrucciones
	|Rcase Exp dosP instrucciones
		;

Ndefault: 
	Rdefault dosP instrucciones
	|
	;
	
Arr: 
	Arr cIzq cDer
	|cIzq cDer
	;


Aumento:
	id mas mas
	;

Decremento: id menos menos
	;



SumaIgual: id mas igual Exp
	;

RestaIgual: id menos igual Exp
	;

insfor: Aumento
	|Decremento
	|SumaIgual
	|RestaIgual
	|id igual Exp
    ;

Param:
	Param coma id dosP Ntipo
	|id dosP Ntipo
	;


Decl:
	Decl id dosP Ntipo Separador
	|id dosP Ntipo Separador
	; 
 
 Separador:
	ptycoma
	|coma
	;


Ntipo:
	Rboolean
    |Rstring
    |Rnumber
    |Rvoid
    |id
	;


LExp:
	LExp coma Exp
	|Exp
	;


Exp:
	 menos Exp %prec UMENOS
	|neg Exp
	|Exp difer Exp
	|Exp dbigual Exp
	|Exp mas Exp
	|Exp menos Exp
	|Exp por Exp
	|Exp div Exp
	|Exp pot Exp
	|Exp mod Exp
	|Exp menor Exp
	|Exp mayor Exp
	|Exp mayorq Exp
	|Exp menorq Exp
	|Exp or Exp
	|Exp and Exp
	|entero
	|decimal
	|Rfalse
	|Rnull
	|Rtrue
	|cIzq LExp cDer
	|cadena
	|cadenaSimple
	|Exp ternario Exp dosP Exp
	|id pIzq pDer
	|id pIzq Lparam pDer				
	|llIzq Par llDer
	|Objeto
	|Objeto punto Rlength
	|id pIzq pDer punto Rlength
	|id pIzq Lparam pDer punto Rlength
	|pIzq Exp pDer
	|id
	;

	Par: Par coma id dosP Exp
	|id dosP Exp
	;


	Lparam:	Lparam coma Exp
	|Exp
	
	;

