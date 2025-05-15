import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PonderacionesService } from '../../../services/ponderaciones.service';
import {
  EvaluacionPonderada,
  DetallePonderacion,
  PreguntaAgrupada
} from '../../../models/ponderaciones.model';
import { CommonModule } from '@angular/common';
import { MatSliderModule } from '@angular/material/slider';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-listar-ponderacion',
  standalone: true,
  imports: [
    CommonModule,
    MatSliderModule,
    ReactiveFormsModule,
    FormsModule,
    MatRadioModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule
  ],
  templateUrl: './listar-ponderacion.component.html',
  styleUrls: ['./listar-ponderacion.component.scss']
})
export class ListarPonderacionComponent implements OnInit {
  evaluaciones: (EvaluacionPonderada & { preguntasAgrupadas: PreguntaAgrupada[] })[] = [];
  expandedId: number | null = null;
  activeMenuId: number | null = null;

  private pondService = inject(PonderacionesService);
  private router = inject(Router);

  ngOnInit() {
    this.pondService.getPonderacionesCompletas()
      .subscribe(evs => {
        this.evaluaciones = evs.map(ev => ({
          ...ev,
          preguntasAgrupadas: this.groupByPreguntas(ev.detalles)
        }));
      });
  }

  toggleMenu(id: number) {
    this.activeMenuId = this.activeMenuId === id ? null : id;
  }

  expandirEvaluacion(id: number) {
    this.expandedId = this.expandedId === id ? null : id;
  }

  minimizarEvaluacion() {
    this.expandedId = null;
  }

  editarPonderaciones(id: number) {
    this.router.navigate([`/admin/gestion-ponderacion/editar/${id}`]);
  }

  /**
   * Agrupa los detalles por pregunta_id,
   * creando para cada pregunta un array `items` con:
   *  - para texto/discretas: un solo elemento
   *  - para likert: tantas subpreguntas como haya
   */
  private groupByPreguntas(detalles: DetallePonderacion[]): PreguntaAgrupada[] {
    const map = new Map<number, PreguntaAgrupada>();

    for (const d of detalles) {
      if (!map.has(d.pregunta_id)) {
        map.set(d.pregunta_id, {
          pregunta_id: d.pregunta_id,
          pregunta_texto: d.pregunta_texto,
          tipo: d.tipo,
          items: []
        });
      }
      map.get(d.pregunta_id)!.items.push(d);
    }

    return Array.from(map.values());
  }
}
