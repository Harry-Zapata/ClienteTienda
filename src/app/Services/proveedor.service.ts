import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../Interfaces/response-api';
import { Proveedor } from '../Interfaces/proveedor';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private urlApi:string = environment.endPoint + "proveedor/"
  constructor(private http: HttpClient) { }

  lista():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(this.urlApi + "Lista");
  }
  guardar(request: Proveedor): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(this.urlApi + "Guardar", request);
  }
  editar(request: Proveedor): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(this.urlApi + "Editar", request);
  }
  eliminar(id: number): Observable<ResponseApi> {
    return this.http.delete<ResponseApi>(this.urlApi + "Eliminar/" + id);
  }
}
