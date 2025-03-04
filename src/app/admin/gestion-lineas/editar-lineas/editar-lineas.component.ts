import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { LineasService } from '../../../services/lineas.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-editar-lineas',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatIconModule],
  templateUrl: './editar-lineas.component.html',
  styleUrl: './editar-lineas.component.scss'
})
export class EditarLineasComponent implements OnInit {
  lineaForm!: FormGroup; // Asegura que siempre haya una referencia
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private lineasService = inject(LineasService);

  ngOnInit() {
    // Inicializamos el formulario antes de usarlo en el HTML
    this.inicializarFormulario();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarLinea(+id);
    }
  }

  /** 📌 Inicializar el formulario */
  inicializarFormulario() {
    this.lineaForm = this.fb.group({
      nombre: [''],
      descripcion: ['']
    });
  }

  /** 📌 Cargar la línea de intervención por ID */
  cargarLinea(id: number) {
    this.lineasService.obtenerLineaPorId(id).subscribe({
      next: (data) => {
        if (data) {
          this.lineaForm.patchValue(data);
        }
      },
      error: (err) => console.error('❌ Error al cargar la línea:', err)
    });
  }

  /** 📌 Guardar cambios */
  onSubmit() {
    if (this.lineaForm.valid) {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.lineasService.actualizarLinea(+id, this.lineaForm.value).subscribe({
          next: () => {
            alert('✅ Línea actualizada correctamente');
            this.router.navigate(['/admin/gestion-lineas/listar']);
          },
          error: (err) => console.error('❌ Error al actualizar línea:', err)
        });
      }
    }
  }
  volver() {
    this.router.navigate(['/admin/gestion-lineas/listar']);
  }
}
