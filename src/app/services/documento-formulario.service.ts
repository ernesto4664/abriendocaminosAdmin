// src/app/services/documento-formulario.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient }      from '@angular/common/http';
import { Observable }      from 'rxjs';
import { environment }     from '../../environments/environment';

export interface Documento {
  id: number;
  nombre: string;
  formulario_destino: 'nna' | 'beneficios' | 'noticias';
  ruta_archivo: string; // p.e. "/storage/documentos/foo-123.pdf"
  created_at: string;
  updated_at: string;
}

@Injectable({ providedIn: 'root' })
export class DocumentoFormularioService {
  private apiUrl = `${environment.apiBaseUrl}/documentos`;
   private http   = inject(HttpClient);
  

  listar(): Observable<Documento[]> {
    return this.http.get<Documento[]>(this.apiUrl);
  }

  descargar(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/download`, { responseType: 'blob' });
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

actualizar(id: number, data: { nombre: string; formulario_destino: string; archivo?: File }): Observable<any> {
  const formData = new FormData();
  formData.append('nombre', data.nombre || '');
  formData.append('formulario_destino', data.formulario_destino || '');

  if (data.archivo) {
    formData.append('archivo', data.archivo);
  }

  console.log('📦 Enviando datos a la API:');
  formData.forEach((valor, clave) => {
    console.log(`${clave}:`, valor);
  });

  return this.http.put(`${this.apiUrl}/${id}`, formData);
}

  /** 📌 Crear un nuevo documento (con archivo) */
  crearDocumento(formData: FormData): Observable<any> {
    // No necesitas reportProgress ni observe aquí,
    // porque quieres el patrón “fire-and-forget” como crearLinea.
    return this.http.post<any>(this.apiUrl, formData);
  }



    /** Nuevo: obtener un solo documento */
  /** 📌 Obtener un documento por ID */
  obtenerDocumento(id: number): Observable<Documento> {
    return this.http.get<Documento>(`${this.apiUrl}/${id}`);
  }


   /** Actualiza metadatos + archivo vía PUT */
  actualizarConArchivo(id: number, formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}`, formData);
  }
}
