import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Chart } from 'chart.js/auto';
import { Router } from '@angular/router';

interface Usuario {
  nombre: string;
  rut: string;
  profesional: string;
  institucion: string;
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

  constructor(private fb: FormBuilder,
    private router: Router    // ← Inyecta aquí el Route
  ) {}

  ngOnInit() {
    this.searchForm = this.fb.group({ nombre: [''], rut: [''] });

    // Datos de ejemplo
    this.usuarios = Array.from({ length: 20 }).map((_, i) => ({
      nombre: 'María Del Carmen Hernandez Vivas',
      rut: '00000000-00',
      profesional: 'María H.',
      institucion: 'Nombre de ejemplo',
      status: i % 3 === 0 ? 'Finalizado' : (i % 3 === 1 ? 'Sin terminar' : 'En progreso')
    }));

    this.applyFilter();
  }

  ngAfterViewInit() {
    this.initChart();
  }

  applyFilter() {
    const { nombre, rut } = this.searchForm.value;
    this.filtered = this.usuarios.filter(u =>
      u.nombre.toLowerCase().includes(nombre.toLowerCase()) &&
      u.rut.includes(rut)
    );
    this.total = this.filtered.length;
    this.inProgressCount = this.filtered.filter(u => u.status==='En progreso').length;
    this.finalCount      = this.filtered.filter(u => u.status==='Finalizado').length;
    this.sinTerminarCount= this.filtered.filter(u => u.status==='Sin terminar').length;
    this.setupPagination();
  }

  onSearch() {
    this.page = 1;
    this.applyFilter();
  }

  setupPagination() {
    const pageCount = Math.ceil(this.filtered.length / this.pageSize);
    this.pages = Array.from({length: pageCount}, (_, i) => i+1);
    this.setPage(this.page);
  }

  setPage(p: number) {
    if (p < 1 || p > this.pages.length) return;
    this.page = p;
    const start = (p-1)*this.pageSize;
    this.pagedUsers = this.filtered.slice(start, start + this.pageSize);
  }

  onIngresar(u: Usuario) {
    // Si quieres pasar el id en la URL:
    this.router.navigate(['/admin/usuarios-registrados/detalle']);
    
    // Si tu ruta no espera params:
    // this.router.navigate(['/admin/usuarios-registrados/detalle']);
  }

  initChart() {
    const ctx = this.statusChartRef.nativeElement.getContext('2d')!;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
        datasets: [
          {
            label: 'En progreso',
            data: [1,2,1,3,2,3,4,4,3,2,3,4],
            borderColor: '#0d6efd',
            fill: false
          },
          {
            label: 'Finalizado',
            data: [4,3,2,2,3,2,3,2,1,2,1,2],
            borderColor: '#198754',
            fill: false
          },
          {
            label: 'Sin terminar',
            data: [0,1,1,1,1,1,1,1,1,1,1,1],
            borderColor: '#dc3545',
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' }
        }
      }
    });
  }
}
