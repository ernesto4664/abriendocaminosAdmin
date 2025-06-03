import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NnaService {

    private apiUrl = `${environment.apiBaseUrl}/registro-nna`;


  constructor(private http: HttpClient) {}

  registrarNna(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  subirDocumento(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('documento_firmado', file);
    return this.http.post(`${this.apiUrl}/subir-documento`, formData);
  }
// Obtiene los datos del documento (nombre y extensión)
getDocumentoNnaInfo(): Observable<any> {
  return this.http.get(`${this.apiUrl}/documento-nna`);
}

// Descarga el archivo real (con Blob)
descargarDocumentoBlob(): Observable<Blob> {
  return this.http.get(`${this.apiUrl}/documento-nna`, {
    responseType: 'blob'
  });
}
getNnas(): Observable<any> {
  return this.http.get(`${this.apiUrl}/get-nna`);
}
getProfesionalesPorRegion(regionId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/por-region/${regionId}`);
}


}
