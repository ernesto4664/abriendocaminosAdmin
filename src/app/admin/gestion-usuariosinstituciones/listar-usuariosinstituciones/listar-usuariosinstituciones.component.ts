import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsuariosInstitucionService } from '../../../services/usuarios-institucion.service';

@Component({
  selector: 'app-listar-usuariosinstituciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listar-usuariosinstituciones.component.html',
  styleUrl: './listar-usuariosinstituciones.component.scss'
})
export class ListarUsuariosinstitucionesComponent implements OnInit {
  usuariosPorInstitucion: { [key: string]: { institucion: any, usuarios: any[] } } = {};

  private usuariosInstitucionService = inject(UsuariosInstitucionService);
  private router = inject(Router);

  ngOnInit() {
    this.cargarUsuarios();
  }

  /** 📌 Cargar y agrupar usuarios por institución (por ID) */
  cargarUsuarios() {
    this.usuariosInstitucionService.getUsuariosInstitucion().subscribe({
      next: (usuarios) => {
        this.usuariosPorInstitucion = usuarios.reduce((acc: any, usuario: any) => {
          const institucionId = usuario.institucion?.id;
          if (!institucionId) return acc;

          if (!acc[institucionId]) {
            acc[institucionId] = {
              institucion: usuario.institucion,
              usuarios: []
            };
          }

          acc[institucionId].usuarios.push(usuario);
          return acc;
        }, {});
        console.log('✅ Usuarios agrupados por institución:', this.usuariosPorInstitucion);
      },
      error: (err) => console.error('❌ Error al obtener usuarios:', err)
    });
  }

  editarUsuario(id: number) {
    this.router.navigate(['/admin/gestion-usuariosinstituciones/editar', id]);
  }

  eliminarUsuario(id: number) {
    if (confirm('⚠️ ¿Estás seguro de que deseas eliminar a este usuario? Esta acción no se puede deshacer.')) {
      this.usuariosInstitucionService.deleteUsuarioInstitucion(id).subscribe({
        next: () => {
          alert('✅ Usuario eliminado correctamente.');
          this.cargarUsuarios();
        },
        error: (err) => {
          alert('❌ Error al eliminar usuario.');
          console.error('❌ Error:', err);
        }
      });
    }
  }
}
