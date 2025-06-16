import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NnaConCuidadorDetalle, EjecucionInstrumentosService, Evaluacion } from '../../../services/ejecucion-instrumentos.service';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-detalle-ejecucion-instrumento',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './detalle-ejecucion-instrumento.component.html',
  styleUrl: './detalle-ejecucion-instrumento.component.scss'
})
export class DetalleEjecucionInstrumentoComponent implements OnInit {

  nna?: NnaConCuidadorDetalle;
  evaluaciones: Evaluacion[] = [];
  evaluacionSeleccionada: number | null = null;
  estadoEvaluaciones: 'pendiente' | 'en_proceso' | 'finalizado' = 'pendiente'; // <--- NUEVO
  evaluacionEnProceso: any = null; // <--- NUEVO

  constructor(
    private route: ActivatedRoute,
    private ejecucionService: EjecucionInstrumentosService,
    private router: Router,
    private http: HttpClient // <--- Agrega HttpClient aquí
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.ejecucionService.getNnaDetalle(id).subscribe(data => {
      this.nna = data;
      this.obtenerEstadoEvaluacion();
    });
    this.ejecucionService.getEvaluaciones().subscribe(data => {
      this.evaluaciones = data;
    });
  }

  volver() {
    this.router.navigate(['/admin/ejecucion-instrumentos']);
  }

  realizarEvaluacion(id: number | null) {
  if (id && this.nna?.id) {
    this.router.navigate(['/admin/ejecucion-instrumentos/realizar-evaluacion', id, this.nna.id]);
  }
}

obtenerEstadoEvaluacion() {
  if (!this.nna?.id) return;
  this.ejecucionService.getEstadoEvaluacionesNna(this.nna.id).subscribe({
    next: (data) => {
      if (data?.evaluaciones?.length) {
        const estados = data.evaluaciones.map((ev: any) => ev.estado);
        if (estados.includes('finalizada')) {
          this.estadoEvaluaciones = 'finalizado';
          this.evaluacionEnProceso = null;
        } else if (estados.includes('en_proceso')) {
          this.estadoEvaluaciones = 'en_proceso';
          // Busca la evaluación en proceso
          this.evaluacionEnProceso = data.evaluaciones.find((ev: any) => ev.estado === 'en_proceso');
        } else {
          this.estadoEvaluaciones = 'pendiente';
          this.evaluacionEnProceso = null;
        }
      } else {
        this.estadoEvaluaciones = 'pendiente';
        this.evaluacionEnProceso = null;
      }
    },
    error: (err) => {
      console.error('Error al obtener estado de evaluaciones', err);
      this.estadoEvaluaciones = 'pendiente';
      this.evaluacionEnProceso = null;
    }
  });
}

// Ejemplo de uso:
// this.obtenerEstadoEvaluacion(1, 3).subscribe(data => {
//   console.log('Estado:', data);
// });

}
