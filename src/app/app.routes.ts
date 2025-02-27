import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { GestionTerritoriosComponent } from './admin/gestion-territorios/gestion-territorios.component';
import { CrearTerritorioComponent } from './admin/gestion-territorios/crear-territorio/crear-territorio.component';
import { EditarTerritorioComponent } from './admin/gestion-territorios/editar-territorio/editar-territorio.component';
import { DetalleTerritorioComponent } from './admin/gestion-territorios/detalle-territorio/detalle-territorio.component';
import { ListarTerritoriosComponent } from './admin/gestion-territorios/listar-territorios/listar-territorios.component';

import { GestionPlandeintervencionComponent } from './admin/gestion-plandeintervencion/gestion-plandeintervencion.component';
import { CrearPlandeintervencionComponent } from './admin/gestion-plandeintervencion/crear-plandeintervencion/crear-plandeintervencion.component';
import { EditarPlandeintervencionComponent } from './admin/gestion-plandeintervencion/editar-plandeintervencion/editar-plandeintervencion.component';
import { DetallePlandeintervencionComponent } from './admin/gestion-plandeintervencion/detalle-plandeintervencion/detalle-plandeintervencion.component';
import { ListarPlandeintervencionComponent } from './admin/gestion-plandeintervencion/listar-plandeintervencion/listar-plandeintervencion.component';

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

      { path: 'admin/gestion-plandeintervencion', component: GestionPlandeintervencionComponent },
      { path: 'admin/gestion-plandeintervencion/crear', component: CrearPlandeintervencionComponent },
      { path: 'admin/gestion-plandeintervencion/editar/:id', component: EditarPlandeintervencionComponent },
      { path: 'admin/gestion-plandeintervencion/detalle/:id', component: DetallePlandeintervencionComponent },
      { path: 'admin/gestion-plandeintervencion/listar', component: ListarPlandeintervencionComponent },
    ]
  }
];
