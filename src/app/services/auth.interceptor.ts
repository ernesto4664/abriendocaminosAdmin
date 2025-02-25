import { HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest, HttpHandlerFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const apiToken = 'BASEAPISYSTEMDocker'; // Token de seguridad

  // Clonamos la solicitud agregando el header del token
  const authReq = req.clone({
    setHeaders: {
      'Api-Token': apiToken
    }
  });

  return next(authReq);
};
