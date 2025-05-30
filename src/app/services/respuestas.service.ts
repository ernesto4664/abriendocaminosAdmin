import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RespuestasService {
  private apiUrl = `${environment.apiBaseUrl}/respuestas`;

  private apiUrlR = `http://13.58.212.158/api/v1`;
  private http = inject(HttpClient);

  constructor() {}

  
  getRespuesta(): Observable<any> {
    return this.http.get<any>(`${this.apiUrlR}/respuestas`);
}

  /** 📌 Obtener respuestas por evaluación */
  getRespuestasPorEvaluacion(evaluacionId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrlR}/respuestas/por-evaluacion/${evaluacionId}`);
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
    console.log(`📡 Enviando actualización para ID: ${id}`, data);
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }
  
  /** 📌 Método en el servicio para eliminar una respuesta */
  eliminarRespuesta(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrlR}/respuestas/${id}`);
  }

  guardarRespuestas(requestBody: any): Observable<any> {
    console.log("🔍 Enviando datos al backend:", requestBody); // Depuración
    return this.http.post<any>(this.apiUrl, requestBody);
  }

  getRespuestaById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrlR}/respuestas/${id}`);
  }
  
  actualizarRespuesta(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrlR}/respuestas/${id}`, data);
  }

  actualizarRespuestas(data: any): Observable<any> {
    return this.http.put(`${this.apiUrlR}/respuestas-multiple`, data);
  }
    
  eliminarRespuestasPorPregunta(preguntaId: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrlR}/respuestas/pregunta/${preguntaId}`
    );
  }

    existeDetalle(evaluacionId: number): Observable<boolean> {
    return this.http
      .get<{ tiene: boolean }>(`${this.apiUrlR}/ponderaciones/existe-detalle/${evaluacionId}`)
      .pipe(
        map(res => res.tiene)
      );
  }

    limpiarDetalle(evaluacionId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrlR}/ponderaciones/${evaluacionId}`
    );
  }

    eliminarDetalle(detalleId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrlR}/ponderaciones/detalle/${detalleId}`
    );
  }

  limpiarPreguntaCompleta(preguntaId: number, evaluacionId: number, tipo: string): Observable<any> {
    return this.http.request('delete', `${this.apiUrlR}/respuestas/pregunta/${preguntaId}/evaluacion/${evaluacionId}`, {
      body: { tipo } // ✅ ya no "nuevo_tipo"
    });
  }

  limpiarPreguntaConTipo(preguntaId: number, evaluacionId: number, tipo: string): Observable<any> {
    return this.http.post(
      `${this.apiUrlR}/respuestas/pregunta/${preguntaId}/evaluacion/${evaluacionId}/limpiar`,
      { tipo }
    );
  }

}
