import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Chart } from 'chart.js/auto';
import { Router } from '@angular/router';

// servicios nuevos
import { TerritoriosService } from './../../services/territorios.service';
import { InstitucionesEjecutorasService } from './../../services/institucionesejecutoras.service';

interface Usuario {
  nombre: string;
  rut: string;
  profesional: string;
  institucion: string;
  institucion_id: number;
  region_id: number;
  status: 'En progreso' | 'Finalizado' | 'Sin terminar';
}

@Component({
  selector: 'app-todoslosnnaregistrados',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './todoslosnnaregistrados.component.html',
  styleUrls: ['./todoslosnnaregistrados.component.scss']
})
export class TodoslosnnaRegistradosComponent implements OnInit, AfterViewInit {
  @ViewChild('statusChart') statusChartRef!: ElementRef<HTMLCanvasElement>;

  searchForm!: FormGroup;
  usuarios: Usuario[] = [];
  filtered: Usuario[] = [];
  pagedUsers: Usuario[] = [];
  page = 1;
  pageSize = 5;
  pages: number[] = [];
  total = 0;
  inProgressCount = 0;
  finalCount = 0;
  sinTerminarCount = 0;
  today = new Date();

  // Listas para filtros
  regiones: any[] = [];
  instituciones: any[] = [];
  profesionales: string[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private territoriosSvc: TerritoriosService,
    private instsSvc: InstitucionesEjecutorasService
  ) {}

  ngOnInit() {
    // 1) Inicializa el formulario
    this.searchForm = this.fb.group({
      nombre: [''],
      rut: [''],
      region_id: [''],
      institucion_id: [''],
      profesional: ['']
    });

    // 2) Carga las regiones para el filtro
    this.territoriosSvc.getRegiones().subscribe({
      next: regiones => this.regiones = regiones,
      error: err => console.error('❌ Error al cargar regiones:', err)
    });

    // 3) Carga las instituciones y extrae los profesionales únicos
    this.instsSvc.getInstituciones().subscribe({
      next: instituciones => {
        this.instituciones = instituciones;

        // Creamos un Set<string> con los nombres de profesional
        const set = new Set<string>(
          instituciones.map((inst: any) => inst.profesional as string)
        );

        // TS sabe que Array.from(set) es string[]
        this.profesionales = Array.from(set);

        // Después de tener filtros listos, carga los datos de NNA
        // Aquí simulo datos de ejemplo; en tu caso vendrán de un servicio
        this.usuarios = Array.from({ length: 20 }).map((_, i) => ({
          nombre: 'Usuario ' + (i+1),
          rut: `0000000${i}-0`,
          profesional: this.profesionales[i % this.profesionales.length] || '',
          institucion: this.instituciones[i % this.instituciones.length]?.nombre_fantasia || '',
          institucion_id: this.instituciones[i % this.instituciones.length]?.id || 0,
          region_id: this.instituciones[i % this.instituciones.length]?.territorio?.region_id?.[0] || 0,
          status: i % 3 === 0 ? 'Finalizado' : (i % 3 === 1 ? 'Sin terminar' : 'En progreso')
        }));

        // Aplica el filtro inicial
        this.applyFilter();
      },
      error: err => console.error('❌ Error al cargar instituciones:', err)
    });
  }

  ngAfterViewInit() {
    this.initChart();
  }

  applyFilter() {
    const { nombre, rut, region_id, institucion_id, profesional } = this.searchForm.value;

    this.filtered = this.usuarios.filter(u =>
      u.nombre.toLowerCase().includes(nombre.toLowerCase()) &&
      u.rut.includes(rut) &&
      (!region_id || u.region_id === +region_id) &&
      (!institucion_id || u.institucion_id === +institucion_id) &&
      (!profesional || u.profesional === profesional)
    );

    this.total = this.filtered.length;
    this.inProgressCount  = this.filtered.filter(u => u.status==='En progreso').length;
    this.finalCount       = this.filtered.filter(u => u.status==='Finalizado').length;
    this.sinTerminarCount = this.filtered.filter(u => u.status==='Sin terminar').length;

    this.setupPagination();
  }

  onSearch() {
    this.page = 1;
    this.applyFilter();
  }

  setupPagination() {
    const pageCount = Math.ceil(this.filtered.length / this.pageSize);
    this.pages = Array.from({ length: pageCount }, (_, i) => i+1);
    this.setPage(this.page);
  }

  setPage(p: number) {
    if (p<1||p>this.pages.length) return;
    this.page = p;
    const start = (p-1)*this.pageSize;
    this.pagedUsers = this.filtered.slice(start, start+this.pageSize);
  }

  onIngresar(u: Usuario) {
    this.router.navigate(['/admin/usuarios-registrados/detalle']);
  }

  initChart() { /* tu lógica Chart.js */ }
}
