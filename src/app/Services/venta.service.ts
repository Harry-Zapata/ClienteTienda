import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Venta } from '../Interfaces/venta';
import { ResponseApi } from '../Interfaces/response-api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private urlApi:string = environment.endPoint + "Venta/"
  constructor(private http: HttpClient) { }

  registrar(request: Venta): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(this.urlApi + "Registrar", request);
  }

  historial(buscarPor:string,numeroVenta:string,fechaInicio:string,fechaFin:string): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(this.urlApi+"Historial?buscarPor="+buscarPor+"&numeroVenta="+numeroVenta+"&fechaInicio="+fechaInicio+"&fechaFin="+fechaFin);
  }

  reporte(fechaInicio:string,fechaFin:string): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(this.urlApi+"Reporte?fechaInicio="+fechaInicio+"&fechaFin="+fechaFin);
  }
}
