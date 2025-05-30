import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthUserService {
  
  private apiUrl = `${environment.apiBaseUrl}/auth-usuarios-institucion`;
  
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const payload = { email, password };
    return this.http.post(`${this.apiUrl}/login`, payload);
  }
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario'); // si lo usas
  }
}
