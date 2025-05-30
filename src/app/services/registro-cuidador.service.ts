import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CuidadorService {
  
  private apiUrl = `${environment.apiBaseUrl}/registro-cuidador`;

  constructor(private http: HttpClient) {}

  registrarCuidador(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
  getDocumentoCuidadorInfo(): Observable<any> {
  return this.http.get(`${this.apiUrl}/documento-cuidador`);
}
}
