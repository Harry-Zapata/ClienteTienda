import { Component, OnInit , AfterViewInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { CategoriaService } from 'src/app/Services/categoria.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { Categoria } from 'src/app/Interfaces/categoria';
import { ModalCategoriaComponent } from '../../Modales/modal-categoria/modal-categoria.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit, AfterViewInit {

  columnasTabla: string[] = ['id','nombre','acciones'];
  dataInicio: Categoria[] = [];
  dataListaCategorias = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacioTabla!: MatPaginator;

  constructor(
    private dialog:MatDialog,
    private _categoriaServicio: CategoriaService,
    private _utilidadServicio: UtilidadService
  ){}
  obtenerCategorias(){
    this._categoriaServicio.lista().subscribe(
      {
        next: (data) => {
          if (data.status) {
          this.dataListaCategorias.data = data.value
          }else{
            this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Upps!")
          }
        },
        error: (e) => { }
      })
  }

  ngOnInit(): void {
    this.obtenerCategorias();
  }

  ngAfterViewInit(): void {
    this.dataListaCategorias.paginator = this.paginacioTabla;
  }

  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaCategorias.filter = filterValue.trim().toLowerCase();
  }

  nuevaCategoria(){
    this.dialog.open(ModalCategoriaComponent,{
      disableClose: true,
    }).afterClosed().subscribe(
      resultado => {
        if (resultado == "true") {
          this.obtenerCategorias();
        }
      }
    )
  }

  editarCategoria(categoria: Categoria){
    this.dialog.open(ModalCategoriaComponent,{
      disableClose: true,
      data: categoria
    }).afterClosed().subscribe(
      resultado => {
        if (resultado == "true") {
          this.obtenerCategorias();
        }
      }
    )
  }

  eliminarCategoria(categoria: Categoria){
    Swal.fire({
      title: 'Desea Eliminar esta Categoria?',
      text: categoria.nombre,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, Eliminar!',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, Volver!'
    }).then((result) => {
      if (result.isConfirmed) {
        this._categoriaServicio.eliminar(categoria.idCategoria).subscribe(
          {
            next: (data) => {
              if (data.status) {
                this._utilidadServicio.mostrarAlerta("La categoria fue eliminado", "Exito");
                this.obtenerCategorias();
              }
              else {
                this._utilidadServicio.mostrarAlerta("No se pudo Eliminar la categoria", "Error");
              }
            },
            error: (e) => { }
          }
        )
      }
    })
  }

}
