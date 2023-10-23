import { Component, Inject, OnInit, inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Categoria } from 'src/app/Interfaces/categoria';
import { CategoriaService } from 'src/app/Services/categoria.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
@Component({
  selector: 'app-modal-categoria',
  templateUrl: './modal-categoria.component.html',
  styleUrls: ['./modal-categoria.component.css']
})
export class ModalCategoriaComponent {

  formularioCategoria: FormGroup;
  tituloAccion: string = 'Agregar';
  botonAccion: string = 'Guardar';
  listaCategorias: Categoria[] = [];

  constructor(
    private modalActual: MatDialogRef<ModalCategoriaComponent>,
    @Inject(MAT_DIALOG_DATA) public datosCategoria: Categoria,
    private fb: FormBuilder,
    private _categoriaServicio: CategoriaService,
    private _utilidadServicio: UtilidadService
  ){
    this.formularioCategoria = this.fb.group({
      nombre: ['', Validators.required],
    });

    if (this.datosCategoria != null) {
      this.tituloAccion = 'Editar';
      this.botonAccion = 'Actualizar';
    }
  }

  ngOnInit(): void {
    if (this.datosCategoria != null) {
      this.formularioCategoria.patchValue({
        nombre: this.datosCategoria.nombre,
      })
    }
  }

  guardarEditar_Categoria() {
    const _categoria: Categoria = {
      idCategoria: this.datosCategoria == null ? 0 : this.datosCategoria.idCategoria,
      nombre: this.formularioCategoria.value.nombre,
    }

    if (this.datosCategoria == null) {
      this._categoriaServicio.guardar(_categoria).subscribe(
        {
          next: (data) => {
            if (data.status) {
              this._utilidadServicio.mostrarAlerta("La Categoria Fue Registrada Correctamente", "Exito");
              this.modalActual.close("true")
            }
            else {
              this._utilidadServicio.mostrarAlerta("No se pudo Registrar la Categoria", "Error");
            }
          },
          error: (e) => { }
        }
      )
    }
    else {
      this._categoriaServicio.editar(_categoria).subscribe(
        {
          next: (data) => {
            if (data.status) {
              this._utilidadServicio.mostrarAlerta("La Categoria Fue Editada Correctamente", "Exito");
              this.modalActual.close("true")
            }
            else {
              this._utilidadServicio.mostrarAlerta("No se pudo Editar la Categoria", "Error");
            }
          },
          error: (e) => { }
        }
      )

    }
  }
}
