import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NnaConCuidador {
  id: number;
  rut: string;
  nombres: string;
  apellidos: string;
  edad: number;
  sexo: string;
  nacionalidad: string;
  profesional_id: number;
  institucion_id: number;
  documentos_cuidadores: string;
}

export interface Cuidador {
  id: number;
  rut: string;
  dv: string;
  nombres: string;
  apellidos: string;
  asignar_nna: number;
  sexo: string;
  edad: number;
  parentesco_aspl: string;
  parentesco_nna: string;
  nacionalidad: string;
  participa_programa: number;
  motivo_no_participa: string | null;
  documento_firmado: string;
  created_at: string;
  updated_at: string;
}

export interface NnaConCuidadorDetalle {
  id: number;
  profesional_id: number;
  institucion_id: number;
  rut: string;
  dv: string;
  nombres: string;
  apellidos: string;
  edad: number;
  sexo: string;
  vias_ingreso: string;
  parentesco_aspl: string;
  parentesco_cp: string;
  nacionalidad: string;
  participa_programa: number;
  motivo_no_participa: string | null;
  documento_firmado: string;
  created_at: string;
  updated_at: string;
  profesional_nombres: string;
  profesional_apellidos: string;
  profesional_email: string;
  profesional_rut: string;
  institucion_nombre: string;
  institucion_rut: string;
  institucion_email: string;
  cuidador: Cuidador;
  aspl: any;
}

export interface Evaluacion {
  id: number;
  nombre: string;
  descripcion?: string;
  // Agrega aquí otros campos según la respuesta real de la API
}

@Injectable({
  providedIn: 'root'
})
export class EjecucionInstrumentosService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  getNnasConCuidador(): Observable<NnaConCuidador[]> {
    return this.http.get<NnaConCuidador[]>(`${this.apiUrl}/api/nna-con-cuidadores`);
  }

  getNnaDetalle(id: number): Observable<NnaConCuidadorDetalle> {
    return this.http.get<NnaConCuidadorDetalle>(`${this.apiUrl}/api/nna/${id}`);
  }

  getEvaluaciones(): Observable<Evaluacion[]> {
    return this.http.get<Evaluacion[]>(`${this.apiUrl}/api/evaluaciones`);
  }

  getDetalleEvaluacion(id: number) {
    return this.http.get<any>(`${this.apiUrl}/api/evaluacion/${id}`);
  }

  guardarRespuestaParcial(payload: any) {
  return this.http.post(`${this.apiUrl}/api/evaluaciones/respuestas-parciales`, payload);
}


}