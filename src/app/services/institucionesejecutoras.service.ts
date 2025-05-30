import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InstitucionesEjecutorasService {
  private http = inject(HttpClient);
  private apiBaseUrl = `${environment.apiBaseUrl}/instituciones`;

  /** 📌 Obtener todas las instituciones ejecutoras */
  getInstituciones(): Observable<any> {
    return this.http.get<any>(this.apiBaseUrl);
  }

  /** 📌 Obtener una institución ejecutora por su ID */
  getInstitucionById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/${id}`);
  }

  /** 📌 Crear una nueva institución ejecutora */
  crearInstitucion(institucion: any): Observable<any> {
    return this.http.post<any>(this.apiBaseUrl, institucion);
  }

  /** 📌 Actualizar una institución ejecutora */
  updateInstitucion(id: number, institucion: any): Observable<any> {
    return this.http.put<any>(`${this.apiBaseUrl}/${id}`, institucion);
  }

  /** 📌 Eliminar una institución ejecutora */
  deleteInstitucion(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiBaseUrl}/${id}`);
  }

  getInstitucionesPorRegion(regionId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}?region_id=${regionId}`);
  }
  
  buscarPorNombre(): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/buscarPorNombre`);
  }
  
}
