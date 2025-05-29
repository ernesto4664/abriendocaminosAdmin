import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NnaService } from '../../../services/registro-nna.service';
import { InstitucionesEjecutorasService } from '../../../services/institucionesejecutoras.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-registro-nna',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule, MatButtonModule, MatIconModule],
  templateUrl: './registro-nna.component.html',
  styleUrls: ['./registro-nna.component.scss']
})
export class RegistroNnaComponent implements OnInit {
  private UrlStorage = `${environment.UrlStorage}`;
  nnaForm!: FormGroup;
  documentoFirmadoFile: File | null = null;
  viasIngreso = ['Derivación', 'Voluntario', 'Otro'];
  parentescosAspl = ['Madre', 'Padre', 'Tío/a', 'Abuelo/a'];
  parentescosCp = ['Hermano/a', 'Primo/a', 'Tutor'];
  nacionalidades = ['Chilena', 'Argentina', 'Peruana', 'Otra'];
  nnaId!: number;
  instituciones: any[] = [];
  profesionales = [
    { id: 1, nombre: 'Juan Pérez' },
    { id: 2, nombre: 'María López' },
    { id: 3, nombre: 'Carlos González' }
  ];


  constructor(
    private fb: FormBuilder,
    private nnaService: NnaService,
    private institucionService: InstitucionesEjecutorasService
  ) {}

  ngOnInit(): void {
    this.nnaForm = this.fb.group({
      profesional: ['', Validators.required],
      institucion: ['', Validators.required],
      rutNna: ['', Validators.required],
      dvNna: ['', Validators.required],
      viasIngreso: ['', Validators.required],
      nombresNna: ['', Validators.required],
      apellidosNna: ['', Validators.required],
      edadNna: ['', Validators.required],
      sexoNna: ['', Validators.required],
      parentescoAsplNna: ['', Validators.required],
      parentescoCpNna: ['', Validators.required],
      nacionalidadNna: ['', Validators.required],
      participaPrograma: [true, Validators.required],
      motivoNoParticipa: ['']
    });

    this.nnaForm.get('profesional')?.setValue(2); // Default: Juan Pérez

    this.nnaForm.get('participaPrograma')?.valueChanges.subscribe(val => {
      if (val === false) {
        this.documentoFirmadoFile = null;
      } else {
        this.nnaForm.get('motivoNoParticipa')?.setValue('');
      }
    });

    this.institucionService.getInstituciones().subscribe({
      next: (res) => {
        this.instituciones = res;
      },
      error: (err) => console.error(err)
    });
  }

  validarRutNna(): void {
    const { rutNna, dvNna } = this.nnaForm.value;
    console.log('Validando RUT NNA:', `${rutNna}-${dvNna}`);
    // Aquí puedes invocar tu servicio de validación
  }

  descargarDocumento(): void {
    this.nnaService.getDocumentoNnaInfo().subscribe({
      next: (data) => {
        const downloadName = data.downloadName;
        const extension = data.extension;

        this.nnaService.descargarDocumentoBlob().subscribe({
          next: (blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = `${this.UrlStorage}/` + extension;
            a.download = downloadName;
            a.click();
            URL.revokeObjectURL(url);
          },
          error: (err) => {
            console.error('❌ Error al descargar el archivo:', err);
            alert('No se pudo descargar el archivo.');
          }
        });
      },
      error: (err) => {
        console.error('❌ Error al obtener datos del documento:', err);
        alert('No se pudo obtener la información del documento de NNA.');
      }
    });
  }

  onDocumentoFirmadoChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.documentoFirmadoFile = input.files[0];
    }
  }

  onSubmit() {
    if (this.nnaForm.invalid) return;

    const formData = new FormData();

    formData.append('profesional', this.nnaForm.value.profesional);
    formData.append('institucion', this.nnaForm.value.institucion);
    formData.append('rut', this.nnaForm.value.rutNna);
    formData.append('dv', this.nnaForm.value.dvNna);
    formData.append('nombres', this.nnaForm.value.nombresNna);
    formData.append('apellidos', this.nnaForm.value.apellidosNna);
    formData.append('edad', this.nnaForm.value.edadNna);
    formData.append('sexo', this.nnaForm.value.sexoNna);
    formData.append('vias_ingreso', this.nnaForm.value.viasIngreso);
    formData.append('parentesco_aspl', this.nnaForm.value.parentescoAsplNna);
    formData.append('parentesco_cp', this.nnaForm.value.parentescoCpNna);
    formData.append('nacionalidad', this.nnaForm.value.nacionalidadNna);
    formData.append('participa_programa', this.nnaForm.value.participaPrograma);

    if (this.nnaForm.value.participaPrograma === false) {
      formData.append('motivo_no_participa', this.nnaForm.value.motivoNoParticipa);
    }

    // 👉 Agregar archivo si está presente
    if (this.documentoFirmadoFile) {
      formData.append('documento_firmado', this.documentoFirmadoFile);
    }

    this.nnaService.registrarNna(formData).subscribe({
      next: (res) => {
        console.log('✅ Registro exitoso', res);
      },
      error: (err) => {
        console.error('❌ Error al registrar NNA', err);
      }
    });

    console.log('Formulario enviado', formData);
  }
}
