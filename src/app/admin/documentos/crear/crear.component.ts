import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule }                   from '@angular/common';
import { Router }                         from '@angular/router';
import { HttpClientModule, HttpEventType }from '@angular/common/http';
import { DocumentoFormularioService }     from '../../../services/documento-formulario.service';


@Component({
  selector: 'app-cargar-documento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  providers: [DocumentoFormularioService],
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.scss']
})
export class CargarDocumentoComponent implements OnInit {

  formulario!: FormGroup;
  formulariosDisponibles = [
    { id: 'NNA', nombre: 'Formulario NNA' },
    { id: 'ASPL', nombre: 'Formulario ASPL' },
    { id: 'Cuidador/a Principal', nombre: 'Formulario Cuidador/a Principal' }
  ];
  archivoSeleccionado: File | null = null;
  cargando = false;
  progreso = 0;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private documentoFormularioService = inject(DocumentoFormularioService);

  ngOnInit(): void {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      formulario_destino: ['', Validators.required],
      // el control 'archivo' no es necesario porque lo manejamos manualmente,
      // pero lo dejamos para validar “required”
      archivo: [null, Validators.required]
    });
  }

  /** 📌 Inicializa el formulario */
  inicializarFormulario(): void {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      formulario_destino: ['', Validators.required],
      archivo: [null, Validators.required]
    });
  }

  get f() {
    return this.formulario.controls;
  }

  /** 📁 Maneja el cambio de archivo */
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.archivoSeleccionado = input.files[0];
      this.f['archivo'].setValue(this.archivoSeleccionado);
    } else {
      this.archivoSeleccionado = null;
      this.f['archivo'].setValue(null);
    }
  }

  /** 📤 Enviar formulario */
  onSubmit(): void {
    if (this.formulario.invalid || !this.archivoSeleccionado) {
      alert('⚠️ Completa todos los campos y selecciona un archivo.');
      this.formulario.markAllAsTouched();
      return;
    }

    // Creamos FormData igual que hacíamos en update
    const fd = new FormData();
    fd.append('nombre', this.formulario.value.nombre);
    fd.append('formulario_destino', this.formulario.value.formulario_destino);
    fd.append('archivo', this.archivoSeleccionado!, this.archivoSeleccionado!.name);

    this.cargando = true;
    this.documentoFormularioService.crearDocumento(fd).subscribe({
      next: () => {
        alert('✅ Documento creado correctamente');
        this.router.navigate(['/admin/gestion-documentos/listar']);
      },
      error: err => {
        console.error('❌ Error al crear documento', err);
        alert('❌ No se pudo crear el documento');
        this.cargando = false;
      }
    });
  }


  /** 🔁 Resetea el formulario */
  private resetFormulario(): void {
    this.formulario.reset();
    this.archivoSeleccionado = null;
    this.progreso = 0;
    this.cargando = false;
  }
}
