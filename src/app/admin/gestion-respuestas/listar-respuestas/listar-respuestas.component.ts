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
  imports: [CommonModule, MatSliderModule, ReactiveFormsModule, FormsModule, MatRadioModule, MatSelectModule, MatButtonModule, MatFormFieldModule],
  templateUrl: './listar-respuestas.component.html',
  styleUrls: ['./listar-respuestas.component.scss']
})
export class ListarRespuestasComponent implements OnInit {

  evaluaciones: any[] = [];
  expandedId: number | null = null;
  activeMenuId: number | null = null;

  private respuestasService = inject(RespuestasService);
  private router = inject(Router);

  ngOnInit() {
    this.cargarEvaluaciones();  // Cargar las evaluaciones
  }

  cargarEvaluaciones() {
    this.respuestasService.getRespuesta().subscribe({
      next: (data) => {
        console.log(data);
        if (data && Array.isArray(data.evaluaciones)) {
          this.evaluaciones = data.evaluaciones;
        }
      },
      error: (err) => {
        console.error('Error al cargar las evaluaciones:', err);
      }
    });
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

    // Función para redirigir al módulo de edición de respuestas
    editarRespuestas(evaluacionId: number) {
      this.router.navigate([`/admin/gestion-respuestas/editar/${evaluacionId}`]);
    }
}
