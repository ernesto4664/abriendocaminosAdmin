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
  
  ngOnInit() {
    this.cargarRespuestas();
  }

  /** 📌 Cargar y agrupar respuestas por evaluación */
  cargarRespuestas() {
    this.respuestasService.getRespuestas().subscribe({
      next: (respuestas) => {
        this.respuestasPorEvaluacion = respuestas.reduce((acc, respuesta) => {
          // ✅ Verifica si la evaluación existe en la pregunta
          const evaluacionNombre = respuesta.pregunta?.evaluacion?.nombre || 'Sin evaluación';
  
          // ✅ Si la evaluación ya existe en el objeto, agrega la nueva respuesta
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
  

  eliminarRespuesta(id: number) {
    if (confirm('¿Estás seguro de eliminar esta respuesta?')) {
      this.respuestasService.deleteRespuesta(id).subscribe({
        next: () => {
          alert('✅ Respuesta eliminada con éxito');
          this.cargarRespuestas();
        },
        error: (err) => console.error('❌ Error al eliminar respuesta:', err)
      });
    }
  }

  editarRespuesta(id: number) {
    this.router.navigate(['/admin/gestion-respuestas/editar', id]);
  }
  
}
