import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RespuestasService {
  private apiUrl = `${environment.apiBaseUrl}/respuestas`;
  private apiUrlR = `http://127.0.0.1:8000/api/v1`;
  private http = inject(HttpClient);

  constructor() {}

  /** 📌 Obtener todas las respuestas */
  getRespuestas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /** 📌 Obtener respuestas por evaluación */
  getRespuestasPorEvaluacion(evaluacionId: number): Observable<any> {
    return this.http.get(`${this.apiUrlR}/evaluacion/${evaluacionId}`);
  }
  
  getEvaluacionCompleta(evaluacionId: number): Observable<any> {
    return this.http.get(`${this.apiUrlR}/evaluaciones/${evaluacionId}/completa`);
  }

  /** 📌 Crear nueva respuesta */
  createRespuesta(data: any): Observable<any> {
    console.log('📤 Enviando datos a la API:', data); // 👀 Verificar datos antes de enviarlos
    return this.http.post(this.apiUrl, data);
  }


  /** 📌 Editar respuesta */
  updateRespuesta(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  /** 📌 Eliminar respuesta */
  deleteRespuesta(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  guardarRespuestas(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }
}
