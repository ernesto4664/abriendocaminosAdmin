// Asegúrate de que el tipo evaluacion es adecuado para acceder a 'id'
export interface Evaluacion {
  id: number;
  plan_id: number;
  nombre: string;
  created_at: string;
  updated_at: string;
  preguntas: any[];
}

import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RespuestasService } from '../../../services/respuestas.service';

@Component({
  selector: 'app-listar-respuestas',
  standalone: true,
  imports: [CommonModule, MatSliderModule, ReactiveFormsModule, FormsModule, MatRadioModule,MatSelectModule, MatButtonModule, MatFormFieldModule ],
  templateUrl: './listar-respuestas.component.html',
  styleUrl: './listar-respuestas.component.scss'
})
export class ListarRespuestasComponent implements OnInit {
  evaluaciones: Evaluacion[] = [];
  respuestasPorEvaluacion: { [key: string]: any[] } = {};

  private respuestasService = inject(RespuestasService);
  private router = inject(Router);
  expandedId: string | null = null;
  activeMenuId: string | null = null;

  currentPage: number = 1;
  totalPages: number = 1;
  respuestasPerPage: number = 5;

  ngOnInit() {
    this.cargarRespuestas();  // Método donde asignas las evaluaciones
  }

  cargarRespuestas() {
    this.respuestasService.getRespuesta().subscribe({
      next: (data) => {
        console.log(data);  // Verifica los datos que recibes
        if (data && Array.isArray(data.evaluaciones)) {
          this.respuestasPorEvaluacion = data.evaluaciones.reduce((acc: { [key: string]: any[] }, evaluacion: any) => {
            if (evaluacion.preguntas) {
              evaluacion.preguntas.forEach((pregunta: any) => {
                if (!acc[evaluacion.nombre]) {
                  acc[evaluacion.nombre] = [];
                }
                // Almacenamos la pregunta junto con sus respuestas
                acc[evaluacion.nombre].push({
                  pregunta: pregunta.pregunta,  // La pregunta en sí
                  respuestas: pregunta.respuestas  // Respuestas asociadas
                });
              });
            }
            return acc;
          }, {});
        }
      },
      error: (err) => {
        console.error('Error al cargar las respuestas:', err);
      }
    });
  }
  
  
  
  expandirEvaluacion(id: string) {
    this.expandedId = this.expandedId === id ? null : id;
  }

  minimizarEvaluacion() {
    this.expandedId = null;
  }

  toggleMenu(id: string) {
    this.activeMenuId = this.activeMenuId === id ? null : id;
  }

  editarEvaluacion(evaluacionId: number) {
    console.log("Evaluación ID en la función:", evaluacionId);  // Verifica que el ID es correcto
    if (isNaN(evaluacionId)) {
      console.error("El ID de evaluación no es un número válido:", evaluacionId);
      return;  // Salir si no es un número válido
    }
    this.router.navigate(['/admin/gestion-respuestas/editar', evaluacionId]);
  }
  
  irAPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPages) {
      this.currentPage = pagina;
      this.cargarRespuestas();
    }
  }
}
