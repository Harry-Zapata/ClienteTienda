import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { Menu } from 'src/app/Interfaces/menu';
import { MenuService } from 'src/app/Services/menu.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit{

  listaMenu: Menu[] = [];
  correoUsuario: string = '';
  rolUsusario: string = '';

  constructor(
    private router: Router,
    private _menuServicio: MenuService,
    private _utilidadServicio: UtilidadService,
    ){}

  ngOnInit(): void {
    const usuario = this._utilidadServicio.obtenerSesionUsuario();

    if (usuario != null) {
      this.correoUsuario = usuario.correo;
      this.rolUsusario = usuario.rolDescripcion;

      this._menuServicio.lista(usuario.idUsuario).subscribe(
        {
          next: (data) => {
            if (data.status) {
            this.listaMenu = data.value
            }
          },
          error: (e) => { }
        }
      )
      if (usuario.rolDescripcion=="Administrador") {
        this.router.navigate(['pages/dashboard']);
      }
      if (usuario.rolDescripcion=="Empleado") {
        this.router.navigate(['pages/venta']);
      }
      if(usuario.rolDescripcion=="Supervisor") {
        this.router.navigate(['pages/productos']);
      }
    }
  }

  cerrarSesion(){
    this._utilidadServicio.eliminarSesionUsuario();
    this.router.navigate(['login']);
  }
}
