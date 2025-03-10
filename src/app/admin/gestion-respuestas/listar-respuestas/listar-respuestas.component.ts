import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RespuestasService } from '../../../services/respuestas.service';

@Component({
  selector: 'app-listar-respuestas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listar-respuestas.component.html',
  styleUrl: './listar-respuestas.component.scss'
})
export class ListarRespuestasComponent implements OnInit {
  respuestasPorEvaluacion: { [key: string]: any[] } = {};
  private respuestasService = inject(RespuestasService);
  private router = inject(Router);
  expandedId: string | null = null;
  activeMenuId: string | null = null;

  ngOnInit() {
    this.cargarRespuestas();
  }

  /** 📌 Cargar y agrupar respuestas por evaluación */
  cargarRespuestas() {
    this.respuestasService.getRespuestas().subscribe({
      next: (respuestas) => {
        this.respuestasPorEvaluacion = respuestas.reduce((acc, respuesta) => {
          const evaluacionNombre = respuesta.pregunta?.evaluacion?.nombre || 'Sin evaluación';

          if (!acc[evaluacionNombre]) {
            acc[evaluacionNombre] = [];
          }

          acc[evaluacionNombre].push(respuesta);
          return acc;
        }, {});

        console.log('✅ Respuestas agrupadas por evaluación:', this.respuestasPorEvaluacion);
      },
      error: (err) => console.error('❌ Error al obtener respuestas:', err)
    });
  }

  /** 📌 Expandir evaluación para ver preguntas y respuestas */
  expandirEvaluacion(id: string) {
    this.expandedId = id;
  }

  minimizarEvaluacion() {
    this.expandedId = null;
  }

  toggleMenu(id: string) {
    this.activeMenuId = this.activeMenuId === id ? null : id;
  }

  /** 📌 Editar todas las respuestas de la evaluación seleccionada */
  editarEvaluacion(evaluacionId: number) {
    this.router.navigate(['/admin/gestion-respuestas/editar', evaluacionId]);
  }
}
