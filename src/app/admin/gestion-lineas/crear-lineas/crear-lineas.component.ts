import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LineasService } from '../../../services/lineas.service';

@Component({
  selector: 'app-crear-lineas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './crear-lineas.component.html',
  styleUrl: './crear-lineas.component.scss'
})
export class CrearLineasComponent implements OnInit {
  lineaForm!: FormGroup;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private lineasService = inject(LineasService);

  ngOnInit() {
    this.inicializarFormulario();
  }

  /** 📌 Inicializa el formulario */
  inicializarFormulario() {
    this.lineaForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }

  /** 📌 Enviar formulario */
  onSubmit() {
    if (this.lineaForm.valid) {
      const formData = this.lineaForm.value;
      console.log('📤 Enviando datos:', formData);

      this.lineasService.crearLinea(formData).subscribe({
        next: () => {
          alert('✅ Línea de intervención creada correctamente');
          this.router.navigate(['/admin/gestion-lineas/listar']);
        },
        error: (error) => {
          alert('❌ Error al crear la línea de intervención');
          console.error('❌ Error:', error);
        }
      });
    } else {
      alert('⚠️ Por favor, completa todos los campos antes de guardar.');
    }
  }
}
