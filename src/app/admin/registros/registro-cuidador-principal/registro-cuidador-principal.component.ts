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
import { MatInputModule } from '@angular/material/input';
import { NnaService } from '../../../services/registro-nna.service';
import { CuidadorService } from '../../../services/registro-cuidador.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-registro-cuidador-principal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule,MatButtonModule,MatIconModule],
  templateUrl: './registro-cuidador-principal.component.html',
  styleUrls: ['./registro-cuidador-principal.component.scss']
})
export class RegistroCuidadorPrincipalComponent implements OnInit {
    private UrlStorage = `${environment.UrlStorage}`;
  cuidadorForm!: FormGroup;

  parentescosAspl = ['Madre', 'Padre', 'Tío/a', 'Abuelo/a'];
  parentescosNna = ['Hijo/a', 'Sobrino/a'];
  nacionalidades = ['Chilena', 'Argentina', 'Peruana'];
  listaNnas: { id: number; nombre: string }[] = [];
archivoSeleccionado: File | null = null;

  
constructor(private fb: FormBuilder, private cuidadorService: CuidadorService,
    private nnaService: NnaService) {}

  ngOnInit() {
    this.getNnas();
    this.cuidadorForm = this.fb.group({
      rut: ['', Validators.required],
      dv: ['', Validators.required],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      asignarNna: ['', Validators.required],
      sexo: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(0)]],
      parentescoAspl: ['', Validators.required],
      parentescoNna: ['', Validators.required],
      nacionalidad: ['', Validators.required],
      participaPrograma: [true, Validators.required],
      motivoNoParticipa: ['']
    });
  }
  getNnas(): void {
    this.nnaService.getNnas().subscribe({
      next: (response) => {
        this.listaNnas = response.data;
      },
      error: (error) => {
        console.error('Error al cargar NNAs', error);
      }
    });
  }
  validarRut() {
    const { rut, dv } = this.cuidadorForm.value;
    console.log('Validando RUT:', `${rut}-${dv}`);
    // Aquí tu lógica real de validación
  }

  enviarMotivos() {
    const motivo = this.cuidadorForm.get('motivoNoParticipa')?.value;
    console.log('Motivos enviados:', motivo);
    // Aquí podrías enviar el motivo a la API
  }

onSubmit() {
  if (this.cuidadorForm.valid) {
    const formValues = this.cuidadorForm.value;
    const formData = new FormData();

    // Agregar campos de texto / select
    formData.append('rut', formValues.rut);
    formData.append('dv', formValues.dv);
    formData.append('nombres', formValues.nombres);
    formData.append('apellidos', formValues.apellidos);
    formData.append('asignarNna', formValues.asignarNna);
    formData.append('sexo', formValues.sexo);
    formData.append('edad', formValues.edad.toString());
    formData.append('parentescoAspl', formValues.parentescoAspl);
    formData.append('parentescoNna', formValues.parentescoNna);
    formData.append('nacionalidad', formValues.nacionalidad);
    formData.append('participaPrograma', formValues.participaPrograma ? '1' : '0');
    formData.append('motivoNoParticipa', formValues.motivoNoParticipa || '');

    // Agregar archivo si existe y si participa en el programa
    if (formValues.participaPrograma && this.archivoSeleccionado) {
      formData.append('documentoFirmado', this.archivoSeleccionado, this.archivoSeleccionado.name);
    }

    this.cuidadorService.registrarCuidador(formData).subscribe({
      next: (res) => console.log('Registrado:', res),
      error: (err) => {
        console.error('Error al registrar cuidador:', err);
      }
    });
  } else {
    this.cuidadorForm.markAllAsTouched();
  }
}

onFileSelected(event: any): void {
  const file: File = event.target.files[0];
  if (file) {
    this.archivoSeleccionado = file;
    // Puedes realizar validaciones o subirlo aquí
  }
}


  descargarDocumento(): void {
    this.cuidadorService.getDocumentoCuidadorInfo().subscribe({
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
  

}
