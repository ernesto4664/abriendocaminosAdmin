import { HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const apiToken = 'BASEAPISYSTEMDocker';

  console.log('Interceptor ejecutado para:', req.url);

  const authReq = req.clone({
    withCredentials: true, // 🔹 Permitir envío de cookies
    setHeaders: {
      'Api-Token': apiToken
    }
  });

  return next(authReq);
};


