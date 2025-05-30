import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DocumentoFormularioService, Documento } from '../../../services/documento-formulario.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-editar-documento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss']
})
export class EditarDocumentoComponent implements OnInit {
  formulario!: FormGroup;
  formulariosDisponibles = [
    { id: 'NNA', nombre: 'Formulario NNA' },
    { id: 'ASPL', nombre: 'Formulario ASPL' },
    { id: 'Cuidador/a Principal', nombre: 'Formulario Cuidador/a Principal' }
  ];
  documentoId!: number;
  archivoNuevo: File | null = null;
  cargando = false;

  private fb      = inject(FormBuilder);
  private route   = inject(ActivatedRoute);
  private router  = inject(Router);
  private service = inject(DocumentoFormularioService);
  archivo: any;

  ngOnInit() {
    // 1) Obtener ID desde la URL
    this.documentoId = +this.route.snapshot.paramMap.get('id')!;

    // 2) Crear el formGroup con nombres de control idénticos a los campos de la API
    this.formulario = this.fb.group({
      nombre:             ['', Validators.required],
      formulario_destino: ['', Validators.required],
      archivo:            [null]   // campo virtual para validar en el template si quieres
    });

    // 3) Cargar datos existentes y parchearlos
    this.service.obtenerDocumento(this.documentoId).subscribe({
      next: (doc: Documento) => {
        this.formulario.patchValue({
          nombre:             doc.nombre,
          formulario_destino: doc.formulario_destino
        });
      },
      error: (err) => {
        console.error('Error al cargar documento:', err);
        alert('No se pudo cargar el documento');
      }
    });
  }

  // Captura archivo y guarda en archivoNuevo
  onFileChange(event: Event) {
    const input = (event.target as HTMLInputElement);
    if (input.files && input.files.length > 0) {
      this.archivoNuevo = input.files[0];
      // opcional: guardar también en el formControl
      this.formulario.get('archivo')!.setValue(this.archivo);
    } else {
      this.archivoNuevo = null;
      this.formulario.get('archivo')!.setValue(null);
    }
  }

 onSubmit() {
  if (this.formulario.invalid) {
    this.formulario.markAllAsTouched();
    return;
  }
  this.cargando = true;

  const nombre = this.formulario.get('nombre')!.value;
  const destino = this.formulario.get('formulario_destino')!.value;

  // --- Caso A: sin archivo nuevo → sólo JSON
  if (!this.archivoNuevo) {
    this.service.actualizar(this.documentoId, {
      nombre,
      formulario_destino: destino
    }).subscribe({
      next: () => {
        console.log('✅ Metadata actualizada correctamente');
        this.router.navigate(['/admin/documentos/listar']);
      },
      error: (err) => {
        console.error('❌ Error al actualizar metadata', err);
        console.error('Detalles del error (body):', err.error);
        this.cargando = false;
      }
    });
    return;
  }

  // --- Caso B: con archivo nuevo → FormData
  const formData = new FormData();
  formData.append('nombre', nombre);
  formData.append('formulario_destino', destino);
  formData.append('archivo', this.archivoNuevo, this.archivoNuevo.name);

  console.log('📦 Enviando FormData a API:');
  formData.forEach((val, key) => console.log(key, val));

  this.service.actualizarConArchivo(this.documentoId, formData).subscribe({
    next: () => {
      console.log('✅ Documento y archivo actualizados');
      this.router.navigate(['/admin/documentos/listar']);
    },
    error: (err) => {
      console.error('❌ Error al actualizar con archivo', err);
      console.error('Detalles del error (body):', err.error);
      this.cargando = false;
    }
  });
}

}
