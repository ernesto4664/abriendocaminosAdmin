import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AsplService {

  private apiUrl = `${environment.apiBaseUrl}/registro-aspl`;

  constructor(private http: HttpClient) {}

  registrarNna(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
}
