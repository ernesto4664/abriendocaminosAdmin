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
@Component({
  selector: 'app-registro-cuidador-principal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule,MatButtonModule,MatIconModule],
  templateUrl: './registro-cuidador-principal.component.html',
  styleUrls: ['./registro-cuidador-principal.component.scss']
})
export class RegistroCuidadorPrincipalComponent implements OnInit {
  cuidadorForm!: FormGroup;

  parentescosAspl = ['Madre', 'Padre', 'Tío/a', 'Abuelo/a'];
  parentescosNna = ['Hijo/a', 'Sobrino/a'];
  nacionalidades = ['Chilena', 'Argentina', 'Peruana'];
  listaNnas = [
    { id: 1, nombre: 'Juan Pérez' },
    { id: 2, nombre: 'Ana Gómez' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.cuidadorForm = this.fb.group({
      rut: ['', Validators.required],
      dv: ['', Validators.required],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      sexo: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(0)]],
      parentescoAspl: ['', Validators.required],
      parentescoNna: ['', Validators.required],
      nacionalidad: ['', Validators.required],
      asignarNna: ['', Validators.required],
      participaPrograma: [true, Validators.required],
      motivoNoParticipa: ['']
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
      console.log('Formulario enviado:', this.cuidadorForm.value);
      // Enviar datos al backend...
    } else {
      this.cuidadorForm.markAllAsTouched();
    }
  }
}
