import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { forkJoin, map, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Region, Provincia, Comuna } from '../models/ubicacion.model'; // Importamos modelos

@Injectable({
  providedIn: 'root',
})
export class TerritoriosService {
  private apiBaseUrl = `${environment.apiBaseUrl}/territorios`;
  private apiUbicacionUrl = `${environment.apiBaseUrl}`; // Base URL para ubicaciones
  private http = inject(HttpClient);

  constructor() {}

  /** 📌 Crear un nuevo territorio */
  createTerritorio(data: any): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  /** 📌 Obtener todas las regiones */
  getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(`${this.apiUbicacionUrl}/regiones`);
  }

  /** 📌 Obtener provincias por regiones */
  getProvincias(regionIds: number[]): Observable<Provincia[]> {
    const params = new HttpParams().set('region_ids', regionIds.join(',')); // Convertir array en string separado por comas
    return this.http.get<Provincia[]>(`${this.apiUbicacionUrl}/provincias`, { params });
  }

  /** 📌 Obtener comunas por provincias */
  getComunas(provinciaIds: number[]): Observable<Comuna[]> {
    const params = new HttpParams().set('provincia_ids', provinciaIds.join(',')); // Convertir array en string separado por comas
    return this.http.get<Comuna[]>(`${this.apiUbicacionUrl}/comunas`, { params });
  }

  getTerritorios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}`).pipe(
      map((territorios) =>
        territorios.map((territorio) => ({
          ...territorio,
          region_id: Array.isArray(territorio.region_id) ? territorio.region_id : [],
          provincia_id: Array.isArray(territorio.provincia_id) ? territorio.provincia_id : [],
          comuna_id: Array.isArray(territorio.comuna_id) ? territorio.comuna_id : [],
        }))
      )
    );
  }
  
    getNombresPorIds(regionIds: number[], provinciaIds: number[], comunaIds: number[]): Observable<any> {
    if (!regionIds.length || !provinciaIds.length || !comunaIds.length) {
      console.warn("⚠ Se intentó obtener nombres pero faltan IDs.");
      return of({ regiones: [], provincias: [], comunas: [] }); // Retorna un objeto vacío sin llamar a la API
    }
  
    return forkJoin({
      regiones: regionIds.length > 0 ? this.http.get<any[]>(`${this.apiUbicacionUrl}/regiones?ids=${regionIds.join(',')}`) : of([]),
      provincias: provinciaIds.length > 0 ? this.http.get<any[]>(`${this.apiUbicacionUrl}/provincias?ids=${provinciaIds.join(',')}`) : of([]),
      comunas: comunaIds.length > 0 ? this.http.get<any[]>(`${this.apiUbicacionUrl}/comunas?ids=${comunaIds.join(',')}`) : of([])
    });
    
  }
  
  // Obtener un territorio por ID
  getTerritorioById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/${id}`);
  }

  // Actualizar un territorio
  updateTerritorio(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiBaseUrl}/${id}`, data);
  }
  
}
