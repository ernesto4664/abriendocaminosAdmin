import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RespuestasService } from '../../../services/respuestas.service';

@Component({
  selector: 'app-edit-respuesta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule, MatFormFieldModule, MatButtonModule, MatIconModule],
  templateUrl: './edit-respuesta.component.html',
  styleUrl: './edit-respuesta.component.scss'
})
export class EditRespuestaComponent implements OnInit {
  private fb = inject(FormBuilder);
  private respuestasService = inject(RespuestasService);
  private route = inject(ActivatedRoute);
  public router = inject(Router);

  respuestaForm!: FormGroup;
  respuestaId!: number;

  ngOnInit() {
    this.respuestaId = this.route.snapshot.params['id'];
    this.cargarRespuesta();
  }

  /** 📌 Cargar la respuesta por ID */
  cargarRespuesta() {
    this.respuestasService.getRespuestasPorEvaluacion(this.respuestaId).subscribe({
      next: (respuesta) => {
        this.respuestaForm.patchValue(respuesta);
      },
      error: (err) => console.error('❌ Error al obtener respuesta:', err)
    });
  }

  /** 📌 Guardar cambios */
  onSubmit() {
    if (this.respuestaForm.valid) {
      this.respuestasService.updateRespuesta(this.respuestaId, this.respuestaForm.value).subscribe({
        next: () => {
          alert('✅ Respuesta actualizada con éxito');
          this.router.navigate(['/admin/gestion-respuestas']);
        },
        error: (err) => console.error('❌ Error al actualizar respuesta:', err)
      });
    }
  }
}
