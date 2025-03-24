import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RespuestasService } from '../../../services/respuestas.service';
import { CommonModule } from '@angular/common';
import { MatSliderModule } from '@angular/material/slider';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-listar-respuestas',
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
  templateUrl: './listar-respuestas.component.html',
  styleUrls: ['./listar-respuestas.component.scss']
})
export class ListarRespuestasComponent implements OnInit {

  evaluaciones: any[] = [];
  expandedId: number | null = null;
  activeMenuId: number | null = null;
  apiResponse: any = null; // Guardará el JSON completo
  private respuestasService = inject(RespuestasService);
  private router = inject(Router);

  ngOnInit() {
    this.cargarEvaluaciones();
  }

  cargarEvaluaciones() {
    this.respuestasService.getRespuesta().subscribe({
      next: (data) => {
        console.log("📥 Evaluaciones cargadas:", data);
        this.apiResponse = data; // Guardamos el JSON completo
  
        if (!data || !Array.isArray(data)) {
          console.warn("⚠️ No se encontraron evaluaciones.");
          return;
        }
  
        // 🔍 Filtrar evaluaciones que tienen al menos una pregunta con respuestas
        this.evaluaciones = data.filter(evaluacion => 
          evaluacion.preguntas?.some((pregunta: { respuestas: string | any[]; }) => pregunta.respuestas && pregunta.respuestas.length > 0)
        );
  
        console.log("✅ Evaluaciones filtradas:", this.evaluaciones);
      },
      error: (err) => {
        console.error("❌ Error al cargar evaluaciones:", err);
      }
    });
  }
  
  getOpcionesLikert(pregunta: any, subpreguntaId: number) {
    return pregunta.respuestas?.[0]?.opciones_likert?.filter((opcion: { subpregunta_id: number; }) => opcion.subpregunta_id === subpreguntaId) ?? [];
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

  getOpcionesBarraSatisfaccion(pregunta: any): string {
    return pregunta?.respuestas?.[0]?.opciones_barra_satisfaccion?.length
      ? pregunta.respuestas[0].opciones_barra_satisfaccion.map((o: { valor: any; }) => o.valor).join(', ')
      : 'No hay opciones disponibles';
  }

  editarRespuestas(evaluacionId: number) {
    this.router.navigate([`/admin/gestion-respuestas/editar/${evaluacionId}`]);
  }
}
