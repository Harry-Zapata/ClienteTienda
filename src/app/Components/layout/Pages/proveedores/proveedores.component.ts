import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Proveedor } from 'src/app/Interfaces/proveedor';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { ProveedorService } from 'src/app/Services/proveedor.service';
import { ModalProveedorComponent } from '../../Modales/modal-proveedor/modal-proveedor.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit, AfterViewInit{

  columnasTabla: string[] = ['idProveedor','nombreEmpresa','nombreContacto','direccion','correoElectronico','telefono','producto','acciones'];
  dataInicio: Proveedor[] = [];
  dataListaProveedores = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacioTabla!: MatPaginator;

  constructor(
    private dialog:MatDialog,
    private _ProveedorServicio: ProveedorService,
    private _utilidadServicio: UtilidadService
  ){}

  obtenerProveedores(){
    this._ProveedorServicio.lista().subscribe(
      {
        next: (data) => {
          if (data.status) {
          this.dataListaProveedores.data = data.value
          }else{
            this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Upps!")
          }
        },
        error: (e) => { }
      })
  }

  ngOnInit(): void {
    this.obtenerProveedores();
  }

  ngAfterViewInit(): void {
    this.dataListaProveedores.paginator = this.paginacioTabla;
  }

  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaProveedores.filter = filterValue.trim().toLowerCase();
  }

  nuevoProveedor(){
    this.dialog.open(ModalProveedorComponent,{
      disableClose: true,
    }).afterClosed().subscribe(
      resultado => {
        if (resultado == "true") {
          this.obtenerProveedores();
        }
      }
    )
  }

  editarProveedor(proveedor: Proveedor){
    this.dialog.open(ModalProveedorComponent,{
      disableClose: true,
      data: proveedor
    }).afterClosed().subscribe(
      resultado => {
        if (resultado == "true") {
          this.obtenerProveedores();
        }
      }
    )
  }

  eliminarProveedor(proveedor: Proveedor){
    Swal.fire({
      title: 'Desea Eliminar este Proveedor?',
      text: proveedor.nombreEmpresa,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, Eliminar!',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, Volver!'
    }).then((result) => {
      if (result.isConfirmed && proveedor.idProveedor != null) {
        this._ProveedorServicio.eliminar(proveedor.idProveedor).subscribe(
          {
            next: (data) => {
              if (data.status) {
                this._utilidadServicio.mostrarAlerta("El proveedor fue eliminado", "Exito");
                this.obtenerProveedores();
              }
              else {
                this._utilidadServicio.mostrarAlerta("No se pudo Eliminar el proveedor", "Error");
              }
            },
            error: (e) => { }
          }
        )
      }
    })
  }


}
