import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { GestionTerritoriosComponent } from './admin/gestion-territorios/gestion-territorios.component';
import { CrearTerritorioComponent } from './admin/gestion-territorios/crear-territorio/crear-territorio.component';
import { EditarTerritorioComponent } from './admin/gestion-territorios/editar-territorio/editar-territorio.component';
import { DetalleTerritorioComponent } from './admin/gestion-territorios/detalle-territorio/detalle-territorio.component';
import { ListarTerritoriosComponent } from './admin/gestion-territorios/listar-territorios/listar-territorios.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent, // Aquí aseguramos que el layout se aplique a todas las rutas hijas
    children: [
      { path: 'admin/gestion-territorios', component: GestionTerritoriosComponent },
      { path: 'admin/gestion-territorios/crear', component: CrearTerritorioComponent },
      { path: 'admin/gestion-territorios/editar/:id', component: EditarTerritorioComponent },
      { path: 'admin/gestion-territorios/detalle/:id', component: DetalleTerritorioComponent },
      { path: 'admin/gestion-territorios/listar', component: ListarTerritoriosComponent },
    ]
  }
];
