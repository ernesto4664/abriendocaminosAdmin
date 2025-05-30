import { Injectable, inject } from '@angular/core';
import { HttpClient }         from '@angular/common/http';
import { Observable }         from 'rxjs';
import { environment }        from '../../environments/environment';

import { EvaluacionPonderada } from '../models/ponderaciones.model';

@Injectable({
  providedIn: 'root'
})
export class PonderacionesService {
  private http       = inject(HttpClient);
  private apiBaseUrl = `${environment.apiBaseUrl}/ponderaciones`;

  /** Guarda la nueva ponderación */
  guardarPonderaciones(body: {
    plan_id: number;
    evaluacion_id: number;
    detalles: any[];
  }): Observable<any> {
    return this.http.post<any>(this.apiBaseUrl, body);
  }

  getPonderacionesCompletas(): Observable<EvaluacionPonderada[]> {
    return this.http.get<EvaluacionPonderada[]>(`${this.apiBaseUrl}/completo`);
  }

    /** Obtiene una ponderación específica con sus detalles */
  getPonderacionPorId(id: number): Observable<EvaluacionPonderada> {
    return this.http.get<EvaluacionPonderada>(`${this.apiBaseUrl}/${id}/completo`);
  }

  /** Actualiza una ponderación existente */
  updatePonderacion(id: number, body: {
    plan_id: number;
    evaluacion_id: number;
    detalles: any[];
  }): Observable<any> {
    return this.http.put<any>(`${this.apiBaseUrl}/${id}`, body);
  }
}