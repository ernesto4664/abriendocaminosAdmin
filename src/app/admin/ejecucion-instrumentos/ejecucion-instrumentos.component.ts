import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Chart } from 'chart.js/auto';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // <-- Importa HttpClient
import { EjecucionInstrumentosService, NnaConCuidador } from '../../services/ejecucion-instrumentos.service';

@Component({
  selector: 'app-ejecucion-instrumentos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, HttpClientModule],
  templateUrl: './ejecucion-instrumentos.component.html',
  styleUrl: './ejecucion-instrumentos.component.scss'
})
export class EjecucionInstrumentosComponent implements OnInit, AfterViewInit {
  @ViewChild('statusChart') statusChartRef!: ElementRef<HTMLCanvasElement>;

  searchForm!: FormGroup;
  usuarios: NnaConCuidador[] = [];
  filtered: NnaConCuidador[] = [];
  pagedUsers: NnaConCuidador[] = [];
  page = 1;
  pageSize = 5;
  pages: number[] = [];
  total = 0;
  inProgressCount = 0;
  finalCount = 0;
  sinTerminarCount = 0;
  today = new Date();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private ejecucionService: EjecucionInstrumentosService
  ) {}

  ngOnInit() {
    this.searchForm = this.fb.group({ nombre: [''], rut: [''] });

    // Usa el servicio para obtener los datos
    this.ejecucionService.getNnasConCuidador().subscribe(data => {
      this.usuarios = data;
      this.applyFilter();
    });
  }

  ngAfterViewInit() {
    this.initChart();
  }

  applyFilter() {
    const { nombre, rut } = this.searchForm.value;
    this.filtered = this.usuarios.filter(u =>
      (`${u.nombres} ${u.apellidos}`.toLowerCase().includes(nombre.toLowerCase())) &&
      u.rut.includes(rut)
    );
    this.total = this.filtered.length;
    // Los siguientes contadores pueden ajustarse según la lógica real
    this.inProgressCount = this.filtered.length; // Ejemplo: todos en progreso
    this.finalCount      = 0;
    this.sinTerminarCount= 0;
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

  onIngresar(u: NnaConCuidador) {
    this.router.navigate(['admin/ejecucion-instrumentos/detalle', u.id]);
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
