// src/app/services/ponderaciones.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DetallePonderacion {
  pregunta_id: number;
  subpregunta_id?: number;
  respuesta_correcta?: string | number;
  respuesta_correcta_id?: number;
  valor: number;
 
}

export interface PreguntaPonderada {
  id: number;
  pregunta: string;
  tipos_de_respuesta: { tipo: string }[];
  respuestas?: any[];    // las opciones originales que vinieron del back
  detalles: DetallePonderacion[];
}

export interface EvaluacionPonderada {
  id: number;
  nombre: string;
  preguntas: PreguntaPonderada[];
  puntosTotales: number;
}

@Injectable({
  providedIn: 'root'
})
export class PonderacionesService {
  private http = inject(HttpClient);
  private apiBaseUrl = `${environment.apiBaseUrl}/ponderaciones`;


  guardarPonderaciones(body: any): Observable<any> {
    return this.http.post<any>(this.apiBaseUrl, body);
  }


  getPonderacionesCompletas(): Observable<EvaluacionPonderada[]> {
    return this.http.get<EvaluacionPonderada[]>(`${this.apiBaseUrl}/completo`);
  }
}
