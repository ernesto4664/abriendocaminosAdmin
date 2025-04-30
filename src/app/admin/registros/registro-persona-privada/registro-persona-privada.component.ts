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
  selector: 'app-registro-privada',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule,MatButtonModule, MatIconModule ],
  templateUrl: './registro-persona-privada.component.html',
  styleUrls: ['./registro-persona-privada.component.scss']
})
export class RegistroPrivadaComponent implements OnInit {
  pplForm!: FormGroup;

  listaNnas = [
    { id: 1, nombre: 'Juan Pérez' },
    { id: 2, nombre: 'Ana Gómez' }
  ];
  regionesPenal = ['Región Metropolitana', 'Valparaíso', 'Biobío'];
  nacionalidades = ['Chilena', 'Argentina', 'Peruana', 'Otra'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.pplForm = this.fb.group({
      rutPpl: ['', Validators.required],
      dvPpl: ['', Validators.required],
      asignarNna: ['', Validators.required],

      nombresPpl: ['', Validators.required],
      apellidosPpl: ['', Validators.required],

      sexoPpl: ['', Validators.required],
      centroPenal: ['', Validators.required],

      regionPenal: ['', Validators.required],
      nacionalidadPpl: ['', Validators.required],
      asignarNna2: ['', Validators.required],

      participaPrograma: [true, Validators.required],
      motivoNoParticipa: ['']
    });
  }

  validarRutPpl(): void {
    const { rutPpl, dvPpl } = this.pplForm.value;
    console.log('Validando RUT PPL:', `${rutPpl}-${dvPpl}`);
  }

  enviarMotivos(): void {
    const motivo = this.pplForm.get('motivoNoParticipa')?.value;
    console.log('Motivos enviados:', motivo);
  }

  onSubmit(): void {
    if (this.pplForm.valid) {
      console.log('Registro PPL enviado:', this.pplForm.value);
    } else {
      this.pplForm.markAllAsTouched();
    }
  }
}
