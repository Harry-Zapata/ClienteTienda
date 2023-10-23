import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import * as moment from 'moment';

import { ModalDetalleVentaComponent } from '../../Modales/modal-detalle-venta/modal-detalle-venta.component';

import { Venta } from 'src/app/Interfaces/venta';
import { VentaService } from 'src/app/Services/venta.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { MAT_DATE_FORMATS } from '@angular/material/core';

export const MY_DATA_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY'
  }
}

@Component({
  selector: 'app-historial-venta',
  templateUrl: './historial-venta.component.html',
  styleUrls: ['./historial-venta.component.css'],
  providers: [
     {
       provide: MAT_DATE_FORMATS,useValue:MY_DATA_FORMATS
     }
  ] 
})
export class HistorialVentaComponent implements OnInit, AfterViewInit{

formularioBusqueda: FormGroup;
opcionesBusqueda:any[]=[
  {value: "fecha",descripcion:"Por Fechas"},
  {value: "numero",descripcion:"Numero Venta"}
]
columnasTabla:string[]=["fechaRegistro","numeroDocumento","tipoPago","total","accion"]
dataInicio:Venta[]=[]
datosListaVenta=new MatTableDataSource(this.dataInicio)
@ViewChild(MatPaginator) paginacioTabla!:MatPaginator;
constructor(
  private fb:FormBuilder,
  private dialogo:MatDialog,
  private _ventaServicio:VentaService,
  private _utilidadServicio:UtilidadService
){
  this.formularioBusqueda = fb.group({
    buscarPor:["fecha"],
    numero:[""],
    fechaInicio:[""],
    fechaFin:[""],
  })

  this.formularioBusqueda.get('buscarPor')?.valueChanges.subscribe(
    value=>{
      this.formularioBusqueda.patchValue({
        numero:"",
        fechaInicio:"",
        fechaFin: ""
      })
    }
  )


}

ngOnInit(): void {
  
}


ngAfterViewInit(): void {
  this.datosListaVenta.paginator = this.paginacioTabla;
}

aplicarFiltroTabla(event: Event){
  const filterValue = (event.target as HTMLInputElement).value;
  this.datosListaVenta.filter = filterValue.trim().toLowerCase();
}

buscarVentas(){
  let _fechaInicio=""
  let _fechaFin=""
  if (this.formularioBusqueda.value.buscarPor === "fecha" ) {
    _fechaInicio = moment(this.formularioBusqueda.value.fechaInicio).format('DD/MM/YYYY')
    _fechaFin = moment(this.formularioBusqueda.value.fechaFin).format('DD/MM/YYYY')
    
    if (_fechaInicio === "invalid date" || _fechaFin === "invalid date") {
      this._utilidadServicio.mostrarAlerta("Fechas invalidas", "Upps!")
      return
    }
      
    }

    this._ventaServicio.historial(
      this.formularioBusqueda.value.buscarPor,
      this.formularioBusqueda.value.numero,
      _fechaInicio,
      _fechaFin
    ).subscribe(
      {
        next: (data) => {
          if (data.status) {
          this.datosListaVenta = data.value
          }else{
            this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Upps!")
          }
        },
        error: (e) => { }
      })
  }
 verDetalleVenta(_venta:Venta){
   this.dialogo.open(ModalDetalleVentaComponent,{
     data: _venta,
     disableClose: true,
     width: "700px",
   })
 }

}