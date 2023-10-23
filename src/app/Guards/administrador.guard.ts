import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UtilidadService } from '../Reutilizable/utilidad.service';

export const administradorGuard: CanActivateFn = (route, state) => {
  let usuario = JSON.parse(localStorage.getItem('usuario')!);
  const router = inject(Router);
  const _utilidadServicio = inject(UtilidadService);
  if (usuario.rolDescripcion == "Administrador") {
    return true;
  }
  _utilidadServicio.mostrarAlerta("No tiene permiso para acceder a esta seccion", "Opps!");
  router.navigate(['pages']);
  return false;

};
