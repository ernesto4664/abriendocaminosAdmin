import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsuariosInstitucionService } from '../../../services/usuarios-institucion.service';

@Component({
  selector: 'app-listar-usuariosinstituciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listar-usuariosinstituciones.component.html',
})
export class ListarUsuariosinstitucionesComponent implements OnInit {
  grupos: Array<{ institucion: any, usuarios: any[] }> = [];
  seremiUser: any = null;
  mostrarEstablecimientos = false;

  private svc = inject(UsuariosInstitucionService);
  private router = inject(Router);

  ngOnInit() {
    this.svc.getUsuariosInstitucion().subscribe({
      next: usuarios => {
        // Extraer al Seremi (si hay varios, toma el primero)
        this.seremiUser = usuarios.find(u => u.rol === 'SEREMI') || null;

        // Filtrar todos menos el Seremi
        const normales = usuarios.filter(u => u.rol !== 'SEREMI');
        // Agrupar por institucion_id
        const mapa: Record<string, { institucion: any, usuarios: any[] }> = {};
        normales.forEach(u => {
          const id = u.institucion.id.toString();
          if (!mapa[id]) {
            mapa[id] = { institucion: u.institucion, usuarios: [] };
          }
          mapa[id].usuarios.push(u);
        });
        // Convertir a array para *ngFor
        this.grupos = Object.values(mapa);
      },
      error: err => console.error(err)
    });
  }

  toggleEstablecimientos() {
    this.mostrarEstablecimientos = !this.mostrarEstablecimientos;
  }

  editarUsuario(id: number) {
    this.router.navigate(['/admin/gestion-usuariosinstituciones/editar', id]);
  }

  eliminarUsuario(id: number) {
    if (confirm('¿Eliminar este usuario?')) {
      this.svc.deleteUsuarioInstitucion(id).subscribe(() => this.ngOnInit());
    }
  }
}
