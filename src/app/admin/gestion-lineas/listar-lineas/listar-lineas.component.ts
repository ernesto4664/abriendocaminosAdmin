import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LineasService } from '../../../services/lineas.service';

@Component({
  selector: 'app-listar-lineas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listar-lineas.component.html',
  styleUrl: './listar-lineas.component.scss'
})
export class ListarLineasComponent implements OnInit {
  lineas: any[] = [];
  filteredLineas: any[] = [];
  activeMenuId: number | null = null;

  currentPage: number = 1;
  itemsPerPage: number = 5; // Número de elementos por página
  totalPages: number = 1;

  private router = inject(Router);
  private lineasService = inject(LineasService);

  ngOnInit() {
    this.cargarLineas();
  }

  /** 📌 Cargar todas las líneas de intervención */
  cargarLineas() {
    this.lineasService.obtenerLineas().subscribe({
      next: (data) => {
        this.lineas = data;
        this.totalPages = Math.ceil(this.lineas.length / this.itemsPerPage);
        this.irAPagina(1); // Cargar la primera página
        console.log('📌 Líneas cargadas:', this.lineas);
      },
      error: (err) => console.error('❌ Error al cargar líneas:', err)
    });
  }

  /** 📌 Cambiar de página */
  irAPagina(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.filteredLineas = this.lineas.slice(start, end);
  }

  /** 📌 Redirigir a edición */
  editarLinea(id: number) {
    this.router.navigate([`/admin/gestion-lineas/editar/${id}`]);
  }

  /** 📌 Eliminar línea */
  eliminarLinea(id: number) {
    if (confirm('¿Seguro que deseas eliminar esta línea de intervención?')) {
      this.lineasService.eliminarLinea(id).subscribe({
        next: () => {
          alert('✅ Línea eliminada correctamente');
          this.cargarLineas();
        },
        error: (err) => console.error('❌ Error al eliminar línea:', err)
      });
    }
  }

  /** 📌 Control de menú de opciones */
  toggleMenu(id: number) {
    this.activeMenuId = this.activeMenuId === id ? null : id;
  }
}
