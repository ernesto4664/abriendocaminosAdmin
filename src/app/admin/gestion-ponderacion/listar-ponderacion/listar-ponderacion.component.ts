import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  PonderacionesService,
  EvaluacionPonderada,
  PreguntaPonderada,
  DetallePonderacion
} from '../../../services/ponderaciones.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule }   from '@angular/material/menu';
import { MatIconModule }   from '@angular/material/icon';

@Component({
  selector: 'app-listar-ponderacion',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule
  ],
  templateUrl: './listar-ponderacion.component.html',
  styleUrls: ['./listar-ponderacion.component.scss']
})
export class ListarPonderacionComponent implements OnInit {

  evaluaciones: EvaluacionPonderada[] = [];
  expandedId: number | null = null;
  activeMenuId: number | null = null;

  private pondService = inject(PonderacionesService);
  private router     = inject(Router);

  ngOnInit() {
    this.pondService.getPonderacionesCompletas()
      .subscribe(evs => {
        this.evaluaciones = evs.map(ev => ({
          ...ev,
          // calcula la suma de todos los valores
          puntosTotales: ev.preguntas
            .flatMap(p => p.detalles)
            .reduce((sum, det) => sum + (det.valor || 0), 0)
        }));
      });
  }

  /** Suma todos los valores de todas las preguntas de la evaluación */
  calcularPuntosTotales(ev: EvaluacionPonderada): number {
    return ev.preguntas
      .flatMap(p => p.detalles)
      .reduce((sum, det) => sum + (det.valor || 0), 0);
  }

  expandirEvaluacion(id: number) {
    this.expandedId = this.expandedId === id ? null : id;
  }

  minimizarEvaluacion() {
    this.expandedId = null;
  }

  toggleMenu(id: number) {
    this.activeMenuId = this.activeMenuId === id ? null : id;
  }

  editarPonderaciones(evaluacionId: number) {
    this.router.navigate([`/admin/gestion-ponderacion/editar/${evaluacionId}`]);
  }

}