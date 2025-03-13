import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RespuestasService {
  obtenerEvaluaciones() {
    throw new Error('Method not implemented.');
  }
  private apiUrl = `${environment.apiBaseUrl}/respuestas`;
  private apiUrlR = `http://127.0.0.1:8000/api/v1`;
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

  guardarRespuestas(data: any, respuestas: { [preguntaId: number]: any[]; length: number; forEach(arg0: (respuesta: any) => void): unknown; }): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }

  getRespuestaById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrlR}/respuestas/${id}`);
  }
  
  actualizarRespuesta(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrlR}/respuestas/${id}`, data);
  }
  

}
