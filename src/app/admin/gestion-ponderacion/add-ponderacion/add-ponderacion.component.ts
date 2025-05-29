import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule }         from '@angular/common';
import { MatFormFieldModule }   from '@angular/material/form-field';
import { MatSelectModule }      from '@angular/material/select';
import { MatButtonModule }      from '@angular/material/button';
import { MatSliderModule }      from '@angular/material/slider';
import { MatInputModule }       from '@angular/material/input';
import { Router }               from '@angular/router';
import { map }                  from 'rxjs/operators';

import { PonderacionesService }      from '../../../services/ponderaciones.service';
import { PlanesIntervencionService } from '../../../services/plan-intervencion.service';
import { RespuestasService }         from '../../../services/respuestas.service';

@Component({
  selector: 'app-add-ponderacion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatSliderModule,
    MatInputModule
  ],
  templateUrl: './add-ponderacion.component.html',
  styleUrls: ['./add-ponderacion.component.scss']
})
export class AddPonderacionComponent implements OnInit {
  miFormulario!: FormGroup;
  planes: any[]       = [];
  evaluaciones: any[] = [];
  preguntas: any[]    = [];
  valoresPonderacion  = Array.from({ length: 21 }, (_, i) => i * 0.5);

  private fb                = inject(FormBuilder);
  private planService       = inject(PlanesIntervencionService);
  private respuestasService = inject(RespuestasService);
  private pondService       = inject(PonderacionesService);
  private router            = inject(Router);

  ngOnInit() {
    this.miFormulario = this.fb.group({
      plan_id:       ['', Validators.required],
      evaluacion_id: ['', Validators.required]
    });
    this.planService.getPlanes().subscribe(data => this.planes = data);
  }

  onPlanChange(planId: number) {
    this.evaluaciones = [];
    this.preguntas    = [];
    this.resetDynamicControls();
    if (!planId) return;
    this.planService
      .getEvaluacionesConPreguntas(planId)
      .pipe(map(res => res.evaluaciones || []))
      .subscribe(evs => this.evaluaciones = evs);
  }

onEvaluacionChange(evId: number) {
  this.preguntas = [];
  this.resetDynamicControls();
  if (!evId) return;

  this.respuestasService
    .getEvaluacionCompleta(evId)
    .pipe(map(resp => resp.preguntas || []))
    .subscribe(pregs => {
      this.preguntas = pregs.map((p: any) => {
        const tipo = this.tipo(p);
        const r0 = (p.respuestas || [])[0] ?? {};

        let opciones: any[] = [];

        // ✅ Caso 1: opciones reales del backend
        if (Array.isArray(r0.opciones) && r0.opciones.length > 0) {
          opciones = r0.opciones.map((o: any, idx: number) => ({
            id: typeof o.id === 'number' ? o.id : idx + 10000, // asegurar número
            label: o.label,
            valor: o.valor ?? o.label
          }));
        }
        // ✅ Caso 2: tipos con opciones por defecto
        else if (['si_no', 'si_no_noestoyseguro'].includes(tipo)) {
          opciones = [
            { id: 1, label: 'Sí', valor: 'si' },
            { id: 2, label: 'No', valor: 'no' }
          ];
          if (tipo === 'si_no_noestoyseguro') {
            opciones.push({ id: 3, label: 'No estoy seguro', valor: 'no_estoy_seguro' });
          }
        }

        // ✅ Caso 3: sin opciones
        if (!opciones.length) {
          opciones = [{ id: null, label: '(sin opciones)' }];
        }

        // ✅ Likert
        let subs: any[] = [];
        if (tipo === 'likert') {
          const rLikert = (p.respuestas || []).find((r: any) => Array.isArray(r.subpreguntas));
          if (rLikert) {
            subs = rLikert.subpreguntas.map((sp: any) => ({
              id: sp.id,
              texto: sp.texto,
              opciones: sp.opciones || []
            }));
          }
        }

        return { ...p, opcionesRespuesta: opciones, subpreguntas: subs };
      });

      // 🧠 Agregar dinámicamente los controles
      this.preguntas.forEach(p => {
        const tipo = this.tipo(p);
        const id = p.id;

        if (tipo === 'barra_satisfaccion') {
          this.miFormulario.addControl(`valor_${id}`, new FormControl(0, [Validators.required, Validators.min(0), Validators.max(10)]));
        }
        else if (['texto', 'numero'].includes(tipo)) {
          this.miFormulario.addControl(`correcta_${id}`, new FormControl('', Validators.required));
          this.miFormulario.addControl(`valor_${id}`, new FormControl('', Validators.required));
        }
        else if (['si_no', 'si_no_noestoyseguro', '5emojis', 'opcion_personalizada'].includes(tipo)) {
          this.miFormulario.addControl(`correcta_${id}`, new FormControl('', Validators.required));
          this.miFormulario.addControl(`valor_${id}`, new FormControl('', Validators.required));
        }
        else if (tipo === 'likert') {
          p.subpreguntas.forEach((sub: any) => {
            this.miFormulario.addControl(`correcta_${id}_${sub.id}`, new FormControl('', Validators.required));
            this.miFormulario.addControl(`valor_${id}_${sub.id}`, new FormControl('', Validators.required));
          });
        }
      });
    });
}

  private resetDynamicControls() {
    Object.keys(this.miFormulario.controls)
      .filter(k => k.startsWith('correcta_') || k.startsWith('valor_'))
      .forEach(ctrl => this.miFormulario.removeControl(ctrl));
  }

  tipo(p: any): string {
    return p.tipos_de_respuesta?.[0]?.tipo || '';
  }

  submit() {
    if (this.miFormulario.invalid) return;

    const fv = this.miFormulario.value;
    const detalles: any[] = [];

    for (const p of this.preguntas) {
      const t  = this.tipo(p);
      const id = p.id;

      // 🎯 Barra de satisfacción
      if (t === 'barra_satisfaccion') {
        detalles.push({
          pregunta_id: id,
          tipo:        t,
          valor:       fv[`valor_${id}`]
        });
      }

      // 📝 Texto o número
      else if (['texto', 'numero'].includes(t)) {
        const respCorrecta = fv[`correcta_${id}`];
        const valor        = fv[`valor_${id}`];

        if (!respCorrecta || typeof respCorrecta !== 'string') {
          alert(`⚠️ La respuesta correcta de la pregunta "${p.pregunta}" no es válida o está vacía.`);
          return;
        }

        detalles.push({
          pregunta_id:        id,
          tipo:               t,
          respuesta_correcta: respCorrecta,
          valor:              valor
        });
      }

      // ✅ Selección tipo si_no, etc
      else if (['si_no', 'si_no_noestoyseguro', '5emojis', 'opcion_personalizada'].includes(t)) {
        const respuestaId = fv[`correcta_${id}`];
        const valor       = fv[`valor_${id}`];

        if (respuestaId === null || respuestaId === '' || isNaN(Number(respuestaId))) {
          alert(`⚠️ La respuesta correcta de la pregunta "${p.pregunta}" no es válida. Selección requerida.`);
          return;
        }

        detalles.push({
          pregunta_id:           id,
          tipo:                  t,
          respuesta_correcta_id: Number(respuestaId),
          valor:                 valor
        });
      }

      // 🎚️ Likert
      else if (t === 'likert') {
        for (const sub of p.subpreguntas) {
          const respId = fv[`correcta_${id}_${sub.id}`];
          const valor  = fv[`valor_${id}_${sub.id}`];

          if (respId === null || isNaN(Number(respId))) {
            alert(`⚠️ Debes seleccionar una opción válida para la subpregunta "${sub.texto}"`);
            return;
          }

          detalles.push({
            pregunta_id:           id,
            subpregunta_id:        sub.id,
            tipo:                  t,
            respuesta_correcta_id: Number(respId),
            valor:                 valor
          });
        }
      }
    }

    const payload = {
      plan_id:       fv.plan_id,
      evaluacion_id: fv.evaluacion_id,
      detalles
    };

    this.pondService.guardarPonderaciones(payload).subscribe({
      next: () => {
        alert("✅ Ponderaciones guardadas correctamente.");
        this.router.navigate(['/admin/gestion-ponderacion/listar']);
      },
      error: err => {
        console.error("❌ Error al guardar ponderaciones:", err);
        alert("⚠️ Hubo un problema al guardar. Revisa la consola.");
      }
    });
  }

}
