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

          // ✅ Caso 1: opciones vienen desde backend
          if (Array.isArray(r0.opciones) && r0.opciones.length > 0) {
            opciones = r0.opciones.map((o: any, idx: number) => ({
              id: o.id ?? `inject-${p.id}-${idx}`,
              label: o.label,
              valor: o.valor ?? null
            }));
          }

          // ✅ Caso 2: inyectamos opciones por tipo si están vacías
          else if (['si_no', 'si_no_noestoyseguro'].includes(tipo)) {
            opciones = [
              { id: `inject-${p.id}-1`, label: 'SI', valor: 1 },
              { id: `inject-${p.id}-2`, label: 'NO', valor: 2 }
            ];
            if (tipo === 'si_no_noestoyseguro') {
              opciones.push({ id: `inject-${p.id}-3`, label: 'No estoy seguro', valor: null });
            }
          }

          // ✅ Caso 3: sin opciones
          if (!opciones.length) {
            opciones = [{ id: null, label: '(sin opciones)' }];
          }

          // ✅ Likert: subpreguntas con opciones
          let subs: any[] = [];
          if (tipo === 'likert') {
            const rLikert = (p.respuestas || []).find((r: any) => Array.isArray(r.subpreguntas));
            if (rLikert) {
              subs = rLikert.subpreguntas.map((sp: any) => ({
                id: sp.id,
                texto: sp.texto,
                opciones: sp.opciones || []  // 👈 Este es el cambio clave
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
            this.miFormulario.addControl(`valor_${id}`,
              new FormControl(0, [Validators.required, Validators.min(0), Validators.max(10)]));
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

    this.preguntas.forEach(p => {
      const t = this.tipo(p), id = p.id;
      if (t === 'barra_satisfaccion') {
        detalles.push({ pregunta_id: id, tipo: t, valor: fv[`valor_${id}`] });
      } else if (['texto','numero'].includes(t)) {
        detalles.push({
          pregunta_id: id,
          tipo: t,
          respuesta_correcta: fv[`correcta_${id}`],
          valor: fv[`valor_${id}`]
        });
      } else if (['si_no','si_no_noestoyseguro','5emojis','opcion_personalizada'].includes(t)) {
        detalles.push({
          pregunta_id: id,
          tipo: t,
          respuesta_correcta_id: fv[`correcta_${id}`],
          valor: fv[`valor_${id}`]
        });
      } else if (t === 'likert') {
        p.subpreguntas.forEach((sub: any) => {
          detalles.push({
            pregunta_id: id,
            subpregunta_id: sub.id,
            tipo: t,
            respuesta_correcta_id: fv[`correcta_${id}_${sub.id}`],
            valor: fv[`valor_${id}_${sub.id}`]
          });
        });
      }
    });

    this.pondService.guardarPonderaciones({
      plan_id:       fv.plan_id,
      evaluacion_id: fv.evaluacion_id,
      detalles
    }).subscribe(() => this.router.navigate(['/admin/gestion-ponderacion/listar']));
  }
}
