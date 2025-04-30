import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { PonderacionesService } from '../../../services/ponderaciones.service';
import { PlanesIntervencionService } from '../../../services/plan-intervencion.service';
import { RespuestasService } from '../../../services/respuestas.service';

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
  planes: any[] = [];
  evaluaciones: any[] = [];
  preguntas: any[] = [];
  valoresPonderacion = Array.from({ length: 21 }, (_, i) => i * 0.5);

  private fb = inject(FormBuilder);
  private planService = inject(PlanesIntervencionService);
  private respuestasService = inject(RespuestasService);
  private pondService = inject(PonderacionesService);
  private router = inject(Router);

  ngOnInit() {
    this.miFormulario = this.fb.group({
      plan_id: ['', Validators.required],
      evaluacion_id: ['', Validators.required]
    });
    this.planService.getPlanes().subscribe(data => this.planes = data);
  }

  onPlanChange(planId: number) {
    this.evaluaciones = [];
    this.preguntas = [];
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
      .pipe(map(resp => resp.preguntas || resp.evaluacion?.preguntas || []))
      .subscribe(pregs => {
        // Mapeo de preguntas + subpreguntas likert
        this.preguntas = pregs.map((p: any) => {
          const tipo = p.tipos_de_respuesta[0]?.tipo;
          // opciones generales
          const opcionesRespuesta = (p.respuestas || []).flatMap((r: any) => r.opciones || []);
          // extraer subpreguntas en likert
          let subpreguntas: any[] = [];
          if (tipo === 'likert') {
            const respLikert = (p.respuestas || []).find((r: any) => Array.isArray(r.subpreguntas));
            if (respLikert) {
              subpreguntas = (respLikert.subpreguntas || []).map((sp: any) => ({
                id: sp.id,
                texto: sp.texto,
                opciones: sp.opciones_likert || []
              }));
            }
          }
          return { ...p, opcionesRespuesta, subpreguntas };
        });

        // añadir controles
        this.preguntas.forEach(p => {
          const tipo = p.tipos_de_respuesta[0]?.tipo;
          if (tipo === 'barra_satisfaccion') {
            this.miFormulario.addControl(
              `valor_${p.id}`,
              new FormControl(0, [
                Validators.required,
                Validators.min(0),
                Validators.max(10),
                Validators.pattern(/^(?:[0-9]|10)$/)
              ])
            );
          } else if (tipo === 'texto' || tipo === 'numero') {
            this.miFormulario.addControl(
              `correcta_${p.id}`,
              new FormControl('', [
                Validators.required,
                ...(tipo === 'texto'
                  ? [Validators.maxLength(500)]
                  : [Validators.pattern(/^\d+$/)])
              ])
            );
            this.miFormulario.addControl(`valor_${p.id}`, new FormControl('', Validators.required));
          } else if (tipo !== 'likert') {
            this.miFormulario.addControl(`correcta_${p.id}`, new FormControl('', Validators.required));
            this.miFormulario.addControl(`valor_${p.id}`, new FormControl('', Validators.required));
          } else {
            // likert: uno por cada subpregunta
            p.subpreguntas.forEach((sub: { id: any; }) => {
              this.miFormulario.addControl(
                `correcta_${p.id}_${sub.id}`,
                new FormControl('', Validators.required)
              );
              this.miFormulario.addControl(
                `valor_${p.id}_${sub.id}`,
                new FormControl('', Validators.required)
              );
            });
          }
        });
      }, err => console.error('Error cargando evaluación completa:', err));
  }

  private resetDynamicControls() {
    Object.keys(this.miFormulario.controls)
      .filter(key => key.startsWith('correcta_') || key.startsWith('valor_'))
      .forEach(ctrl => this.miFormulario.removeControl(ctrl));
  }

  submit() {
    if (this.miFormulario.invalid) return;
    const fv = this.miFormulario.value;
    const detalles: any[] = [];

    this.preguntas.forEach(p => {
      const tipo = p.tipos_de_respuesta[0]?.tipo;
      if (tipo === 'barra_satisfaccion') {
        detalles.push({ pregunta_id: p.id, tipo, valor: fv[`valor_${p.id}`] });
      } else if (tipo === 'texto' || tipo === 'numero') {
        detalles.push({
          pregunta_id: p.id,
          tipo,
          respuesta_correcta: fv[`correcta_${p.id}`],
          valor: fv[`valor_${p.id}`]
        });
      } else if (tipo !== 'likert') {
        detalles.push({
          pregunta_id: p.id,
          tipo,
          respuesta_correcta_id: fv[`correcta_${p.id}`],
          valor: fv[`valor_${p.id}`]
        });
      } else {
        p.subpreguntas.forEach((sub: { id: any; }) => {
          detalles.push({
            pregunta_id: p.id,
            subpregunta_id: sub.id,
            tipo,
            respuesta_correcta_id: fv[`correcta_${p.id}_${sub.id}`],
            valor: fv[`valor_${p.id}_${sub.id}`]
          });
        });
      }
    });

    const payload = {
      plan_id: fv.plan_id,
      evaluacion_id: fv.evaluacion_id,
      detalles
    };

    this.pondService.guardarPonderaciones(payload)
      .subscribe(
        () => this.router.navigate(['/admin/gestion-ponderacion/listar']),
        err => console.error('Error guardando ponderaciones:', err)
      );
  }
}
