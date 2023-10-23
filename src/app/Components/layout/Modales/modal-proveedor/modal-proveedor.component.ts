import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Producto } from 'src/app/Interfaces/producto';
import { Proveedor } from 'src/app/Interfaces/proveedor';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { ProductoService } from 'src/app/Services/producto.service';
import { ProveedorService } from 'src/app/Services/proveedor.service';

@Component({
  selector: 'app-modal-proveedor',
  templateUrl: './modal-proveedor.component.html',
  styleUrls: ['./modal-proveedor.component.css']
})
export class ModalProveedorComponent implements OnInit {

  formularioProveedor: FormGroup;
  tituloAccion: string = 'Agregar';
  botonAccion: string = 'Guardar';
  listaProveedores: Proveedor[] = [];
  dataListaProductos: any;
  constructor(
    private modalActual: MatDialogRef<ModalProveedorComponent>,
    @Inject(MAT_DIALOG_DATA) public datosProveedor: Proveedor,
    private fb: FormBuilder,
    private _proveedorServicio: ProveedorService,
    private _utilidadServicio: UtilidadService,
    private _productoServicio: ProductoService
  ) {
    this.formularioProveedor = this.fb.group({
      idProveedor: [''],
      nombreEmpresa: ['', Validators.required],
      nombreContacto: ['', Validators.required],
      direccion: ['', Validators.required],
      correoElectronico: ['', Validators.required],
      telefono: ['', Validators.required],
      producto: ['', Validators.required],
    });

    if (this.datosProveedor != null) {
      this.tituloAccion = 'Editar';
      this.botonAccion = 'Actualizar';
    }
  }

  ngOnInit(): void {
    if (this.datosProveedor != null) {
      this.formularioProveedor.patchValue({
        idProveedor: this.datosProveedor.idProveedor,
        nombreEmpresa: this.datosProveedor.nombreEmpresa,
        nombreContacto: this.datosProveedor.nombreContacto,
        direccion: this.datosProveedor.direccion,
        correoElectronico: this.datosProveedor.correoElectronico,
        telefono: this.datosProveedor.telefono,
        producto: this.datosProveedor.producto,
      })
    }
    this.listarProductos();
  }

  guardarEditar_Proveedor() {
    const _proveedor: Proveedor = {
      idProveedor: this.datosProveedor == null ? null : this.datosProveedor.idProveedor,
      nombreEmpresa: this.formularioProveedor.value.nombreEmpresa,
      nombreContacto: this.formularioProveedor.value.nombreContacto,
      direccion: this.formularioProveedor.value.direccion,
      correoElectronico: this.formularioProveedor.value.correoElectronico,
      telefono: this.formularioProveedor.value.telefono,
      producto: this.formularioProveedor.value.producto,
    }

    if (this.datosProveedor == null) {
      this._proveedorServicio.guardar(_proveedor).subscribe(
        {
          next: (data) => {
            if (data.status) {
              this._utilidadServicio.mostrarAlerta("El Proveedor Fue Registrado Correctamente", "Exito");
              this.modalActual.close("true")
            }
            else {
              this._utilidadServicio.mostrarAlerta("No se pudo Registrar el Proveedor", "Error");
            }
          },
          error: (e) => { }
        }
      )
    }
    else {
      this._proveedorServicio.editar(_proveedor).subscribe(
        {
          next: (data) => {
            if (data.status) {
              this._utilidadServicio.mostrarAlerta("El Proveedor Fue Editado Correctamente", "Exito");
              this.modalActual.close("true")
            }
            else {
              this._utilidadServicio.mostrarAlerta("No se pudo Editar el Proveedor", "Error");
            }
          },
          error: (e) => { }
        }
      )

    }
  }

  listarProductos() {
    this._productoServicio.lista().subscribe(
      {
        next: (data) => {
          if (data.status) {
            const lista = data.value as Producto[];
            // combertir lista en un array de nomres
            const listaNombres = lista.map((element) => element.nombre);
            this.dataListaProductos = listaNombres;

          } else {
            this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Upps!")
          }
        },
        error: (e) => { }
      }
    )
  }
}
