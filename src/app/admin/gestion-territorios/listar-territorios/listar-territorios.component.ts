import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TerritoriosService } from '../../../services/territorios.service';

@Component({
  selector: 'app-listar-territorios',
  standalone: true,
  templateUrl: './listar-territorios.component.html',
  styleUrl: './listar-territorios.component.scss',
  imports: [CommonModule, FormsModule]
})
export class ListarTerritoriosComponent implements OnInit {
  territorios: any[] = [];
  filteredTerritorios: any[] = [];
  lineas: any[] = [];
  expandedId: number | null = null;
  activeMenuId: number | null = null;
  searchText: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 15;
  totalPages: number = 0;
  selectedLinea: string = '';

  constructor(private territoriosService: TerritoriosService, private router: Router) {}

  ngOnInit() {
    this.territoriosService.getTerritorios().subscribe({
      next: (data) => {
        console.log("📌 Territorios cargados:", data);
  
        this.territorios = data.map(territorio => ({
          ...territorio,
          region_nombres: this.obtenerNombresString(territorio.regiones),
          provincia_nombres: this.obtenerNombresString(territorio.provincias),
          comuna_nombres: this.obtenerNombresString(territorio.comunas),
          linea_nombre: territorio.linea_nombre || 'Sin asignar' // ✅ Mostrar nombre de la línea
        }));

        this.aplicarFiltros(); // Aplicar filtros después de cargar
      },
      error: (err) => console.error("❌ Error al obtener territorios:", err)
    });

    this.loadLineas(); // ✅ Cargar líneas de intervención
  }

  /** 📌 Cargar todas las líneas de intervención */
  loadLineas() {
    this.territoriosService.getLineas().subscribe({
      next: (data) => {
        this.lineas = data;
        console.log("✅ Líneas de intervención cargadas:", data);
      },
      error: (err) => console.error("⚠️ Error al cargar líneas:", err)
    });
  }

  aplicarFiltros() {
    let resultado = this.territorios;
  
    // Aplicar búsqueda por nombre
    if (this.searchText.trim() !== '') {
      resultado = resultado.filter(t => 
        t.nombre_territorio.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  
    // Aplicar filtro por línea de intervención usando `linea_id`
    if (this.selectedLinea) {
      resultado = resultado.filter(t => t.linea_id === parseInt(this.selectedLinea));
    }
  
    // Calcular paginación
    this.totalPages = Math.ceil(resultado.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages) || 1;
  
    // Obtener elementos de la página actual
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredTerritorios = resultado.slice(start, start + this.itemsPerPage);
  }
    
  // Método para obtener una cadena de nombres
  private obtenerNombresString(lista: any[]): string {
    return lista && lista.length ? lista.map(item => item.nombre).join(', ') : 'Sin asignar';
  }

  toggleMenu(id: number) {
    this.activeMenuId = this.activeMenuId === id ? null : id;
  }

  expandirTerritorio(id: number) {
    this.expandedId = id;
  }

  minimizarTerritorio() {
    this.expandedId = null;
  }

  editarTerritorio(id: number) {
    this.router.navigate([`/admin/gestion-territorios/editar/${id}`]);
  }

  refrescar() {
    this.ngOnInit();
  }

  filtrarTerritorios() {
    this.aplicarFiltros();
  }
  
  irAPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPages) {
      this.currentPage = pagina;
      this.aplicarFiltros();
    }
  }
}
