// src/app/services/territorios.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { forkJoin, map, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Region, Provincia, Comuna } from '../models/ubicacion.model';

@Injectable({
  providedIn: 'root',
})
export class TerritoriosService {
  private http            = inject(HttpClient);
  /** Base para endpoints de ‘territorios’ */
  private apiBaseUrl      = `${environment.apiBaseUrl}/territorios`;
  /** Base para endpoints de ‘líneas’ */
  private apiLineaUrl     = `${environment.apiLineaUrl}/lineas`;
  /** Base para endpoints de ubicaciones genéricas (regiones/provincias/comunas) */
  private apiUbicacionUrl = `${environment.apiBaseUrl}`;

  /** Crear un nuevo territorio */
  createTerritorio(data: any): Observable<any> {
    return this.http.post(
      this.apiBaseUrl,
      data,
      { headers: new HttpHeaders().set('Content-Type', 'application/json') }
    );
  }

  /** Obtener todas las líneas de intervención */
  getLineas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiLineaUrl);
  }

  /** Obtener todas las regiones */
  getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(`${this.apiUbicacionUrl}/regiones`);
  }

  /** Obtener provincias filtradas por IDs de regiones */
  getProvincias(regionIds: number[]): Observable<Provincia[]> {
    const params = new HttpParams().set('region_ids', regionIds.join(','));
    return this.http.get<Provincia[]>(`${this.apiUbicacionUrl}/provincias`, { params });
  }

  /** Obtener comunas filtradas por IDs de provincias */
  getComunas(provinciaIds: number[]): Observable<Comuna[]> {
    const params = new HttpParams().set('provincia_ids', provinciaIds.join(','));
    return this.http.get<Comuna[]>(`${this.apiUbicacionUrl}/comunas`, { params });
  }

  /** Listar todos los territorios */
  getTerritorios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiBaseUrl).pipe(
      map(territorios =>
        territorios.map(t => ({
          ...t,
          region_id: Array.isArray(t.region_id) ? t.region_id : [],
          provincia_id: Array.isArray(t.provincia_id) ? t.provincia_id : [],
          comuna_id: Array.isArray(t.comuna_id) ? t.comuna_id : [],
        }))
      )
    );
  }

  /** Obtener nombres de regiones/provincias/comunas por sus IDs */
  getNombresPorIds(
    regionIds: number[],
    provinciaIds: number[],
    comunaIds: number[]
  ): Observable<{ regiones: any[]; provincias: any[]; comunas: any[] }> {
    if (!regionIds.length && !provinciaIds.length && !comunaIds.length) {
      return of({ regiones: [], provincias: [], comunas: [] });
    }

    return forkJoin({
      regiones: regionIds.length
        ? this.http.get<any[]>(`${this.apiUbicacionUrl}/regiones?ids=${regionIds.join(',')}`)
        : of([]),
      provincias: provinciaIds.length
        ? this.http.get<any[]>(`${this.apiUbicacionUrl}/provincias?ids=${provinciaIds.join(',')}`)
        : of([]),
      comunas: comunaIds.length
        ? this.http.get<any[]>(`${this.apiUbicacionUrl}/comunas?ids=${comunaIds.join(',')}`)
        : of([]),
    });
  }

  /** Obtener un territorio por su ID */
  getTerritorioById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/${id}`);
  }

  /** Actualizar un territorio */
  updateTerritorio(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiBaseUrl}/${id}`, data);
  }
}
