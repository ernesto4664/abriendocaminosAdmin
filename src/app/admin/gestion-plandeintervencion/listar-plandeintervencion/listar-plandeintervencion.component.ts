import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PlanesIntervencionService } from '../../../services/plan-intervencion.service';

@Component({
  selector: 'app-listar-plandeintervencion',
  standalone: true,
  templateUrl: './listar-plandeintervencion.component.html',
  styleUrl: './listar-plandeintervencion.component.scss',
  imports: [CommonModule, FormsModule]
})
export class ListarPlandeintervencionComponent implements OnInit {
  planes: any[] = [];
  filteredPlanes: any[] = [];
  expandedId: number | null = null;
  activeMenuId: number | null = null;
  searchText: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  selectedLinea: string = '';

  private planService = inject(PlanesIntervencionService);
  private router = inject(Router);

  ngOnInit() {
    this.planService.getPlanes().subscribe({
      next: (data) => {
        console.log("📌 Planes de Intervención cargados:", data);
        this.planes = data;
        this.aplicarFiltros();
      },
      error: (err) => console.error("❌ Error al obtener planes:", err)
    });
  }

  aplicarFiltros() {
    let resultado = this.planes;

    // 🔍 Filtro por texto en el nombre del plan
    if (this.searchText.trim() !== '') {
      resultado = resultado.filter(p => 
        p.nombre.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }

    // 🔍 Filtro por Línea de Intervención
    if (this.selectedLinea) {
      resultado = resultado.filter(p => p.linea === this.selectedLinea);
    }

    // 📌 Calcular paginación
    this.totalPages = Math.ceil(resultado.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages) || 1;

    // 📌 Obtener elementos de la página actual
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredPlanes = resultado.slice(start, start + this.itemsPerPage);
  }

  toggleMenu(id: number) {
    this.activeMenuId = this.activeMenuId === id ? null : id;
  }

  expandirPlan(id: number) {
    this.expandedId = id;
  }

  minimizarPlan() {
    this.expandedId = null;
  }

  editarPlan(id: number) {
    this.router.navigate([`/admin/gestion-plandeintervencion/editar/${id}`]);
  }

  refrescar() {
    this.ngOnInit();
  }

  filtrarPlanes() {
    this.aplicarFiltros();
  }

  irAPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPages) {
      this.currentPage = pagina;
      this.aplicarFiltros();
    }
  }
}
