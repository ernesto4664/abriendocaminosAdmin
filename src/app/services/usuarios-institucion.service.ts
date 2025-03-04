import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuariosInstitucionService {
  private apiUrl = `${environment.apiBaseUrl}/usuarios-institucion`;
  private apiInstitucionesUrl = `${environment.apiBaseUrl}/instituciones`;
  private http = inject(HttpClient);

  constructor() {}

  /** 📌 Obtener todas las instituciones */
  getInstituciones(): Observable<any[]> {
    return this.http.get<any[]>(this.apiInstitucionesUrl);
  }

  /** 📌 Obtener todos los usuarios de institución */
  getUsuariosInstitucion(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /** 📌 Crear un nuevo usuario de institución */
  crearUsuarioInstitucion(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  /** 📌 Obtener usuario por ID */
  getUsuarioInstitucionById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /** 📌 Actualizar usuario */
  updateUsuarioInstitucion(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  /** 📌 Eliminar usuario */
  deleteUsuarioInstitucion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
