import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LineasService {
  private apiBaseUrl = `${environment.apiBaseUrl}/lineas`;
  private http = inject(HttpClient);

  /** 📌 Obtener todas las líneas */
  obtenerLineas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}`);
  }

  /** 📌 Obtener una línea por ID */
  obtenerLineaPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/${id}`);
  }

  /** 📌 Crear nueva línea */
  crearLinea(data: any): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}`, data);
  }

  /** 📌 Actualizar línea */
  actualizarLinea(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiBaseUrl}/${id}`, data);
  }

  /** 📌 Eliminar línea */
  eliminarLinea(id: number): Observable<any> {
    return this.http.delete(`${this.apiBaseUrl}/${id}`);
  }
}
