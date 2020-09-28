import { Component, OnInit } from '@angular/core';
import { EjecucionService } from 'src/app/Servicios/ejecucion.service';

@Component({
  selector: 'app-errores',
  templateUrl: './errores.component.html',
  styleUrls: ['./errores.component.css']
})
export class ErroresComponent implements OnInit {

  constructor(private servEj:EjecucionService) { }
  lista:any=[];
  ngOnInit(): void {
        //this.servEj.Ejecucion();
       // this.lista=this.servEj.getErrores();
  }


}
