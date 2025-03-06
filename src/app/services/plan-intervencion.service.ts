import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/plan-intervencion.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PlanesIntervencionService {
  private apiBaseUrl = `${environment.apiBaseUrl}/planes`;
  private http = inject(HttpClient);

  constructor() {}

  /** 📌 Crear un nuevo plan de intervención */
  createPlan(data: any): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  /** 📌 Obtener todos los planes de intervención */
  getPlanes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}`);
  }

  /** 📌 Obtener un plan de intervención por ID */
  getPlanById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/${id}`);
  }

  /** 📌 Actualizar un plan de intervención */
  updatePlan(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiBaseUrl}/${id}`, data);
  }

  /** 📌 Eliminar un plan de intervención */
  deletePlan(id: number): Observable<any> {
    return this.http.delete(`${this.apiBaseUrl}/${id}`);
  }

  getPlanesPorLinea(lineaId: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/por-linea/${lineaId}`);
  }
  
  getPlanPorTerritorio(territorioId: number): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/territorio/${territorioId}`);
  }

  /** 📌 Obtener evaluaciones con preguntas por plan de intervención */
  getEvaluacionesConPreguntas(planId: number): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/${planId}/evaluaciones`);
  }
     
}
