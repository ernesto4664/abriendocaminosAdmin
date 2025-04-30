import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PonderacionesService {
  private api = `${environment.apiBaseUrl}/ponderaciones`;
  private http = inject(HttpClient);

  guardarPonderaciones(body: any): Observable<any> {
    return this.http.post(this.api, body);
  }
}