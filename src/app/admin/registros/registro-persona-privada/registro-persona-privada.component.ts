import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Region, Provincia, Comuna } from '../../../models/ubicacion.model'; // Importamos modelos
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NnaService } from '../../../services/registro-nna.service';
import { AsplService } from '../../../services/registro-aspl.service';
import { TerritoriosService } from '../../../services/territorios.service';
@Component({
  selector: 'app-registro-privada',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './registro-persona-privada.component.html',
  styleUrls: ['./registro-persona-privada.component.scss']
})
export class RegistroPrivadaComponent implements OnInit {
  pplForm!: FormGroup;
regiones: Region[] = [];
  listaNnas: { id: number; nombre: string }[] = [];
  regionesPenal: string[] = ['Región Metropolitana', 'Valparaíso', 'Biobío'];
  nacionalidades: string[] = ['Chilena', 'Argentina', 'Peruana', 'Otra'];

  // Cambiar la inyección de servicios para standalone
constructor(
    private fb: FormBuilder,
    private nnaService: NnaService,
    private asplService: AsplService, private territorioService: TerritoriosService,
  ) {}
  ngOnInit(): void {
    this.initForm();
    this.getNnas();
    this.loadRegiones();

    this.pplForm.get('participaPrograma')?.valueChanges.subscribe(value => {
      const motivoCtrl = this.pplForm.get('motivoNoParticipa');
      if (value === false) {
        motivoCtrl?.setValidators([Validators.required]);
      } else {
        motivoCtrl?.clearValidators();
        motivoCtrl?.setValue('');
      }
      motivoCtrl?.updateValueAndValidity();
    });
  }

  private initForm(): void {
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

  validarRutPpl(): void {
    const { rutPpl, dvPpl } = this.pplForm.value;
    const rutCompleto = `${rutPpl}-${dvPpl}`;
    console.log('Validando RUT PPL:', rutCompleto);
    // Aquí podrías agregar validación real
  }

  onSubmit(): void {
    if (this.pplForm.valid) {
      const payload = {
        rut_ppl: this.pplForm.value.rutPpl,
        dv_ppl: this.pplForm.value.dvPpl,
        asignar_nna_id: this.pplForm.value.asignarNna,
        nombres_ppl: this.pplForm.value.nombresPpl,
        apellidos_ppl: this.pplForm.value.apellidosPpl,
        sexo_ppl: this.pplForm.value.sexoPpl,
        centro_penal: this.pplForm.value.centroPenal,
        region_penal: this.pplForm.value.regionPenal,
        nacionalidad_ppl: this.pplForm.value.nacionalidadPpl,
        participa_programa: this.pplForm.value.participaPrograma,
        motivo_no_participa: this.pplForm.value.motivoNoParticipa
      };

      console.log('Payload a enviar:', payload);

      this.asplService.registrarNna(payload).subscribe({
        next: (res: any) => {
          console.log('Registro exitoso', res);
        },
        error: (err: any) => {
          console.error('Error al enviar:', err);
          if (err.status === 422 && err.error.errors) {
            console.table(err.error.errors);
          }
        }
      });
    } else {
      this.pplForm.markAllAsTouched();
      console.warn('Formulario no válido');
    }
  }
    /** 📌 Cargar todas las regiones */
  loadRegiones(): void {
    this.territorioService.getRegiones().subscribe({
      next: (data) => {
        console.log("✅ Regiones cargadas:", data);
        this.regiones = data;
      },
      error: (err) => console.error("⚠️ Error al cargar regiones:", err),
    });
  }
}
