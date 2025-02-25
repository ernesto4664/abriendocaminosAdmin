import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/services/auth.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { LayoutComponent } from './app/components/layout/layout.component';

bootstrapApplication(AppComponent,{
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(ReactiveFormsModule), // IMPORTANTE: IMPORTAR REACTIVEFORMSMODULE
  ],
}).catch((err) => console.error(err));
