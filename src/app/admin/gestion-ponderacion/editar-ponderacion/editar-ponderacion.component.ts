import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule
} from '@angular/forms';
import { CommonModule }         from '@angular/common';
import { MatFormFieldModule }   from '@angular/material/form-field';
import { MatSelectModule }      from '@angular/material/select';
import { MatButtonModule }      from '@angular/material/button';
import { MatSliderModule }      from '@angular/material/slider';
import { MatInputModule }       from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';

import { PonderacionesService }      from '../../../services/ponderaciones.service';
import { RespuestasService }         from '../../../services/respuestas.service';

@Component({
  selector: 'app-editar-ponderacion',
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
  templateUrl: './editar-ponderacion.component.html',
  styleUrls: ['./editar-ponderacion.component.scss']
})
export class EditarPonderacionComponent implements OnInit {
  miFormulario!: FormGroup;
  preguntas: any[] = [];
  valoresPonderacion = Array.from({length:21},(_,i)=>i*0.5);

  private fb = inject(FormBuilder);
  private pondSvc = inject(PonderacionesService);
  private respSvc = inject(RespuestasService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  pondId!: number;

  ngOnInit() {
    this.miFormulario = this.fb.group({
      plan_id: ['', Validators.required],
      evaluacion_id: ['', Validators.required]
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) return;
    this.pondId = +idParam;

    this.pondSvc.getPonderacionPorId(this.pondId)
      .subscribe(pond => {
        this.miFormulario.patchValue({
          plan_id: pond.plan_id,
          evaluacion_id: pond.evaluacion_id
        });

        this.respSvc.getEvaluacionCompleta(pond.evaluacion_id)
          .subscribe(resp => {
            this.preguntas = resp.preguntas.map((p: any) => {
              const tipo = p.tipos_de_respuesta?.[0]?.tipo || '';
              const r0 = (p.respuestas || [])[0] ?? {};
              let opciones = r0.opciones || [];
              if (!opciones.length && ['si_no', 'si_no_noestoyseguro'].includes(tipo)) {
                opciones = [
                  { id: `inject-${p.id}-1`, label: 'SI' },
                  { id: `inject-${p.id}-2`, label: 'NO' }
                ];
                if (tipo === 'si_no_noestoyseguro') {
                  opciones.push({ id: `inject-${p.id}-3`, label: 'No estoy seguro' });
                }
              }
              if (!opciones.length) {
                opciones = [{ id: null, label: '(sin opciones)' }];
              }

              let subs: any[] = [];
              if (tipo === 'likert') {
                const rLikert = (p.respuestas || []).find((r: any) => Array.isArray(r.subpreguntas));
                if (rLikert) {
                  subs = rLikert.subpreguntas.map((sp: any) => ({
                    id: sp.id,
                    texto: sp.texto,
                    opciones: sp.opciones // 👈 Asegúrate de que aquí es 'opciones' no 'opciones_likert'
                  }));
                }
              }

              return { ...p, opcionesRespuesta: opciones, subpreguntas: subs };
            });

            this.generarControlesDinamicos(pond.detalles || []);
          });
      });
  }

  private generarControlesDinamicos(detalles: any[]) {
    // Limpia controles anteriores
    Object.keys(this.miFormulario.controls)
      .filter(k => k.startsWith('correcta_') || k.startsWith('valor_'))
      .forEach(k => this.miFormulario.removeControl(k));

    // Para cada pregunta de la evaluación
    this.preguntas.forEach(p => {
      const tipo = p.tipos_de_respuesta[0]?.tipo || '';
      const id   = p.id;

      // Filtrar todos los detalles para esta pregunta
      const dets = detalles.filter((d: any) => d.pregunta_id === id);

      if (tipo === 'barra_satisfaccion') {
        const valor = +dets[0]?.valor || 0;
        this.miFormulario.addControl(`valor_${id}`, new FormControl(valor, Validators.required));
      }

      else if (['texto', 'numero'].includes(tipo)) {
        const d = dets[0] || {};
        this.miFormulario.addControl(`correcta_${id}`, new FormControl(d.respuesta_correcta || '', Validators.required));
        this.miFormulario.addControl(`valor_${id}`,     new FormControl(+d.valor || 0, Validators.required));
      }

      else if (['si_no', 'si_no_noestoyseguro', '5emojis', 'opcion_personalizada'].includes(tipo)) {
        const d = dets[0] || {};
        this.miFormulario.addControl(`correcta_${id}`, new FormControl(d.respuesta_correcta_id || '', Validators.required));
        this.miFormulario.addControl(`valor_${id}`,     new FormControl(+d.valor || 0, Validators.required));
      }

      else if (tipo === 'likert') {
        p.subpreguntas.forEach((sub: any) => {
          const d = detalles.find((x: any) => x.pregunta_id === id && x.subpregunta_id === sub.id) || {};
          this.miFormulario.addControl(`correcta_${id}_${sub.id}`, new FormControl(d.respuesta_correcta_id || '', Validators.required));
          this.miFormulario.addControl(`valor_${id}_${sub.id}`,     new FormControl(+d.valor || 0, Validators.required));
        });
      }
    });
  }

  tipo(p: any): string {
    return p.tipos_de_respuesta[0]?.tipo || '';
  }

  submit() {
    if (this.miFormulario.invalid) return;
    const fv = this.miFormulario.value;
    const detalles: any[] = [];

    this.preguntas.forEach(p => {
      const tipo = this.tipo(p), id = p.id;

      // helper para “desempaquetar” selects que vienen en array
      const unpack = (v: any) => Array.isArray(v) ? v[0] : v;

      if (tipo === 'barra_satisfaccion') {
        detalles.push({
          pregunta_id: id,
          tipo,
          valor: unpack(fv[`valor_${id}`])
        });
      }
      else if (['texto','numero'].includes(tipo)) {
        detalles.push({
          pregunta_id: id,
          tipo,
          respuesta_correcta: fv[`correcta_${id}`],  // aquí sigue siendo string/texto
          valor: unpack(fv[`valor_${id}`])
        });
      }
      else if (['si_no','si_no_noestoyseguro','5emojis','opcion_personalizada'].includes(tipo)) {
        detalles.push({
          pregunta_id: id,
          tipo,
          // desempaquetamos aquí
          respuesta_correcta_id: unpack(fv[`correcta_${id}`]),
          valor: unpack(fv[`valor_${id}`])
        });
      }
      else if (tipo === 'likert') {
        p.subpreguntas.forEach((sub: any) => {
          detalles.push({
            pregunta_id: id,
            subpregunta_id: sub.id,
            tipo,
            respuesta_correcta_id: unpack(fv[`correcta_${id}_${sub.id}`]),
            valor: unpack(fv[`valor_${id}_${sub.id}`])
          });
        });
      }
    });

    this.pondSvc.updatePonderacion(this.pondId, {
      plan_id: fv.plan_id,
      evaluacion_id: fv.evaluacion_id,
      detalles
    }).subscribe(() => {
      this.router.navigate(['/admin/gestion-ponderacion/listar']);
    });
  }
}
