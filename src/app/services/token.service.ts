import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private http = inject(HttpClient);

  setApiToken() {
    return this.http.get('http://127.0.0.1:8000/api/set-api-token', { withCredentials: true }).subscribe();
  }
}
