import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InstitucionesEjecutorasService } from '../../../services/institucionesejecutoras.service';
import { TerritoriosService } from '../../../services/territorios.service';

@Component({
  selector: 'app-listar-institucionesejecutoras',
  standalone: true,
  templateUrl: './listar-institucionesejecutoras.component.html',
  styleUrl: './listar-institucionesejecutoras.component.scss',
  imports: [CommonModule, FormsModule]
})
export class ListarInstitucionesejecutorasComponent implements OnInit {
  instituciones: any[] = [];
  filteredInstituciones: any[] = [];
  regiones: any[] = [];
  expandedId: number | null = null;
  activeMenuId: number | null = null;
  searchText: string = '';
  selectedRegion: number | null = null; // Se cambia a number para evitar errores
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;

  private institucionService = inject(InstitucionesEjecutorasService);
  private territoriosService = inject(TerritoriosService);
  private router = inject(Router);

  ngOnInit() {
    this.cargarInstituciones();
    this.cargarRegiones();
  }

  cargarInstituciones() {
    this.institucionService.getInstituciones().subscribe({
      next: (data) => {
        // 1) Ordenar todo por código de territorio al recibir
        data.sort((a: any, b: any) => {
          const ca = a.territorio?.cod_territorio ?? 0;
          const cb = b.territorio?.cod_territorio ?? 0;
          return ca - cb;
        });

        this.instituciones = data;
        this.aplicarFiltros();
      },
      error: (err) => console.error("❌ Error al obtener instituciones:", err)
    });
  }

  cargarRegiones() {
    this.territoriosService.getRegiones().subscribe({
      next: (data) => {
        console.log("✅ Regiones cargadas:", data);
        this.regiones = data;
      },
      error: (err) => console.error("⚠️ Error al obtener regiones:", err)
    });
  }

  aplicarFiltros() {
    let resultado = [...this.instituciones];
  
    // 🔹 Filtrar por texto de búsqueda (nombre de la institución)
    if (this.searchText.trim() !== '') {
      resultado = resultado.filter(i => 
        i.nombre_fantasia?.toLowerCase().includes(this.searchText.toLowerCase().trim())
      );
    }
  
    // 🔹 Filtrar por región seleccionada
    if (this.selectedRegion) {
      resultado = resultado.filter(i => {
        const region = i.territorio?.regiones?.find((r: { id: number | null; }) => r.id == this.selectedRegion);
        return region !== undefined;
      });
    }
  
    // 🔹 Paginar resultados
    this.totalPages = Math.ceil(resultado.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages) || 1;
  
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredInstituciones = resultado.slice(start, start + this.itemsPerPage);
  
    console.log("✅ Instituciones filtradas:", this.filteredInstituciones);
  }
  
  /** 📌 Obtener el nombre de la región */
  getRegionNombre(territorio: any): string {
    return territorio?.regiones?.length ? territorio.regiones[0].nombre : 'No asignada';
  }

  /** 📌 Obtener el nombre de la región */
  getCodigoNombre(territorio: any): string {
    return territorio?.codigos?.length ? territorio.codigos[0].nombre : 'No asignada';
  }

  /** 📌 Obtener la lista de provincias */
  getProvincias(territorio: any): string {
    return territorio?.provincias?.length ? territorio.provincias.map((p: { nombre: any; }) => p.nombre).join(', ') : 'No asignadas';
  }

  /** 📌 Obtener la lista de comunas */
  getComunas(territorio: any): string {
    return territorio?.comunas?.length ? territorio.comunas.map((c: { nombre: any; }) => c.nombre).join(', ') : 'No asignadas';
  }

  toggleMenu(id: number) {
    this.activeMenuId = this.activeMenuId === id ? null : id;
  }

  expandirInstitucion(id: number) {
    this.expandedId = id;
  }

  minimizarInstitucion() {
    this.expandedId = null;
  }

  editarInstitucion(id: number) {
    this.router.navigate(['/admin/gestion-institucionesejecutoras/editar', id]);
  }

  refrescar() {
    this.ngOnInit();
  }

  buscarInstituciones() {
    console.log("🔎 Buscando instituciones...");
    this.aplicarFiltros();
  }  

  irAPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPages) {
      this.currentPage = pagina;
      this.aplicarFiltros();
    }
  }
}
