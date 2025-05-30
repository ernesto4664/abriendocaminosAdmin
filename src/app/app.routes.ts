import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { MiperfilComponent } from './admin/miperfil/miperfil.component';

import { GestionTerritoriosComponent } from './admin/gestion-territorios/gestion-territorios.component';
import { CrearTerritorioComponent } from './admin/gestion-territorios/crear-territorio/crear-territorio.component';
import { EditarTerritorioComponent } from './admin/gestion-territorios/editar-territorio/editar-territorio.component';
import { DetalleTerritorioComponent } from './admin/gestion-territorios/detalle-territorio/detalle-territorio.component';
import { ListarTerritoriosComponent } from './admin/gestion-territorios/listar-territorios/listar-territorios.component';

import { GestionLineasComponent } from './admin/gestion-lineas/gestion-lineas.component';
import { CrearLineasComponent } from './admin/gestion-lineas/crear-lineas/crear-lineas.component';
import { EditarLineasComponent } from './admin/gestion-lineas/editar-lineas/editar-lineas.component';
import { DetalleLineasComponent } from './admin/gestion-lineas/detalle-lineas/detalle-lineas.component';
import { ListarLineasComponent } from './admin/gestion-lineas/listar-lineas/listar-lineas.component';

import { GestionPlandeintervencionComponent } from './admin/gestion-plandeintervencion/gestion-plandeintervencion.component';
import { CrearPlandeintervencionComponent } from './admin/gestion-plandeintervencion/crear-plandeintervencion/crear-plandeintervencion.component';
import { EditarPlandeintervencionComponent } from './admin/gestion-plandeintervencion/editar-plandeintervencion/editar-plandeintervencion.component';
import { DetallePlandeintervencionComponent } from './admin/gestion-plandeintervencion/detalle-plandeintervencion/detalle-plandeintervencion.component';
import { ListarPlandeintervencionComponent } from './admin/gestion-plandeintervencion/listar-plandeintervencion/listar-plandeintervencion.component';

import { GestionInstitucionesejecutorasComponent } from './admin/gestion-institucionesejecutoras/gestion-institucionesejecutoras.component';
import { CrearInstitucionesejecutorasComponent } from './admin/gestion-institucionesejecutoras/crear-institucionesejecutoras/crear-institucionesejecutoras.component';
import { EditarInstitucionesejecutorasComponent } from './admin/gestion-institucionesejecutoras/editar-institucionesejecutoras/editar-institucionesejecutoras.component';
import { DetalleInstitucionesejecutorasComponent } from './admin/gestion-institucionesejecutoras/detalle-institucionesejecutoras/detalle-institucionesejecutoras.component';
import { ListarInstitucionesejecutorasComponent } from './admin/gestion-institucionesejecutoras/listar-institucionesejecutoras/listar-institucionesejecutoras.component';

import { GestionUsuariosinstitucionesComponent } from './admin/gestion-usuariosinstituciones/gestion-usuariosinstituciones.component';
import { CrearUsuariosinstitucionesComponent } from './admin/gestion-usuariosinstituciones/crear-usuariosinstituciones/crear-usuariosinstituciones.component';
import { EditarUsuariosinstitucionesComponent } from './admin/gestion-usuariosinstituciones/editar-usuariosinstituciones/editar-usuariosinstituciones.component';
import { DetalleUsuariosinstitucionesComponent } from './admin/gestion-usuariosinstituciones/detalle-usuariosinstituciones/detalle-usuariosinstituciones.component';
import { ListarUsuariosinstitucionesComponent } from './admin/gestion-usuariosinstituciones/listar-usuariosinstituciones/listar-usuariosinstituciones.component';

import { ListarRespuestasComponent } from './admin/gestion-respuestas/listar-respuestas/listar-respuestas.component';
import { AddRespuestaComponent } from './admin/gestion-respuestas/add-respuesta/add-respuesta.component';
import { EditRespuestaComponent } from './admin/gestion-respuestas/edit-respuesta/edit-respuesta.component';
import { RegistroCuidadorPrincipalComponent } from './admin/registros/registro-cuidador-principal/registro-cuidador-principal.component';
import { RegistroNnaComponent } from './admin/registros/registro-nna/registro-nna.component';
import { RegistroPrivadaComponent } from './admin/registros/registro-persona-privada/registro-persona-privada.component';
import { UsuariosRegistradosComponent } from './admin/usuarios-registrados/usuarios-registrados.component';
import { DetalleSectionComponent } from './admin/usuarios-registrados/detalle/registro-detalle/registro-detalle.component';


import { GestionPonderacionComponent } from './admin/gestion-ponderacion/gestion-ponderacion.component';
import { AddPonderacionComponent } from './admin/gestion-ponderacion/add-ponderacion/add-ponderacion.component';
import { EditarPonderacionComponent } from './admin/gestion-ponderacion/editar-ponderacion/editar-ponderacion.component';
import { DetallePonderacionComponent } from './admin/gestion-ponderacion/detalle-ponderacion/detalle-ponderacion.component';
import { ListarPonderacionComponent } from './admin/gestion-ponderacion/listar-ponderacion/listar-ponderacion.component';


import { CargarDocumentoComponent } from './admin/documentos/crear/crear.component';
import { EditarDocumentoComponent } from './admin/documentos/editar/editar.component';
import { ListarDocumentosComponent } from './admin/documentos/listar/listar.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent, // Aquí aseguramos que el layout se aplique a todas las rutas hijas
    children: [
      { path: 'admin', component: DashboardComponent },
      { path: 'admin/miperfil', component: MiperfilComponent },
      { path: 'admin/gestion-territorios', component: GestionTerritoriosComponent },
      { path: 'admin/gestion-territorios/crear', component: CrearTerritorioComponent },
      { path: 'admin/gestion-territorios/editar/:id', component: EditarTerritorioComponent },
      { path: 'admin/gestion-territorios/detalle/:id', component: DetalleTerritorioComponent },
      { path: 'admin/gestion-territorios/listar', component: ListarTerritoriosComponent },

      { path: 'admin/gestion-lineas', component: GestionLineasComponent },
      { path: 'admin/gestion-lineas/crear', component: CrearLineasComponent },
      { path: 'admin/gestion-lineas/editar/:id', component: EditarLineasComponent },
      { path: 'admin/gestion-lineas/detalle/:id', component: DetalleLineasComponent },
      { path: 'admin/gestion-lineas/listar', component: ListarLineasComponent },

      { path: 'admin/gestion-plandeintervencion', component: GestionPlandeintervencionComponent },
      { path: 'admin/gestion-plandeintervencion/crear', component: CrearPlandeintervencionComponent },
      { path: 'admin/gestion-plandeintervencion/editar/:id', component: EditarPlandeintervencionComponent },
      { path: 'admin/gestion-plandeintervencion/detalle/:id', component: DetallePlandeintervencionComponent },
      { path: 'admin/gestion-plandeintervencion/listar', component: ListarPlandeintervencionComponent },

      { path: 'admin/gestion-institucionesejecutoras', component: GestionInstitucionesejecutorasComponent },
      { path: 'admin/gestion-institucionesejecutoras/crear', component: CrearInstitucionesejecutorasComponent },
      { path: 'admin/gestion-institucionesejecutoras/editar/:id', component: EditarInstitucionesejecutorasComponent },
      { path: 'admin/gestion-institucionesejecutoras/detalle/:id', component: DetalleInstitucionesejecutorasComponent },
      { path: 'admin/gestion-institucionesejecutoras/listar', component: ListarInstitucionesejecutorasComponent },

      { path: 'admin/gestion-usuariosinstituciones', component: GestionUsuariosinstitucionesComponent },
      { path: 'admin/gestion-usuariosinstituciones/crear', component: CrearUsuariosinstitucionesComponent },
      { path: 'admin/gestion-usuariosinstituciones/editar/:id', component: EditarUsuariosinstitucionesComponent },
      { path: 'admin/gestion-usuariosinstituciones/detalle/:id', component: DetalleUsuariosinstitucionesComponent },
      { path: 'admin/gestion-usuariosinstituciones/listar', component: ListarUsuariosinstitucionesComponent },

      { path: 'admin/gestion-respuestas/crear', component: AddRespuestaComponent },
      { path: 'admin/gestion-respuestas/editar/:id', component: EditRespuestaComponent },
      { path: 'admin/gestion-respuestas/listar', component: ListarRespuestasComponent },

      { path: 'admin/gestion-ponderacion', component: GestionPonderacionComponent },
      { path: 'admin/gestion-ponderacion/add', component: AddPonderacionComponent },
      { path: 'admin/gestion-ponderacion/editar/:id', component: EditarPonderacionComponent },
      { path: 'admin/gestion-ponderacion/detalle/:id', component: DetallePonderacionComponent },
      { path: 'admin/gestion-ponderacion/listar', component: ListarPonderacionComponent },

      { path: 'admin/registro/registro-cuidador-principal', component: RegistroCuidadorPrincipalComponent },
      { path: 'admin/registro/registro-nna', component: RegistroNnaComponent },
      { path: 'admin/registro/registro-persona-privada', component: RegistroPrivadaComponent },

      { path: 'admin/usuarios-registrados', component: UsuariosRegistradosComponent },
      { path: 'admin/usuarios-registrados/detalle', component: DetalleSectionComponent },

      { path: 'admin/documentos/add', component: CargarDocumentoComponent },
      { path: 'admin/documentos/listar', component: ListarDocumentosComponent },
      { path: 'admin/documentos/editar/:id', component: EditarDocumentoComponent },
      
    ]
  }
];
