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
  selector: 'app-registro-nna',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule,MatButtonModule,MatIconModule],
  templateUrl: './registro-nna.component.html',
  styleUrls: ['./registro-nna.component.scss']
})
export class RegistroNnaComponent implements OnInit {
  nnaForm!: FormGroup;

  viasIngreso = ['Derivación', 'Voluntario', 'Otro'];
  parentescosAspl = ['Madre', 'Padre', 'Tío/a', 'Abuelo/a'];
  parentescosCp = ['Hermano/a', 'Primo/a', 'Tutor'];
  nacionalidades = ['Chilena', 'Argentina', 'Peruana', 'Otra'];

  constructor(private fb: FormBuilder) {}

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
  }

  validarRutNna(): void {
    const { rutNna, dvNna } = this.nnaForm.value;
    console.log('Validando RUT NNA:', `${rutNna}-${dvNna}`);
    // Aquí puedes invocar tu servicio de validación
  }



  onSubmit(): void {
    if (this.nnaForm.valid) {
      console.log('Formulario NNA enviado:', this.nnaForm.value);
      // Lógica de envío al backend...
    } else {
      this.nnaForm.markAllAsTouched();
    }
  }
}
