import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { EjecucionInstrumentosService } from '../../../services/ejecucion-instrumentos.service';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

interface Opcion {
  id: number;
  label: string;
  valor: string | number | null;
}

interface TipoRespuesta {
  id: number;
  tipo: string;
}

interface Pregunta {
  id: number;
  pregunta: string;
  tipo: TipoRespuesta;
  opciones: Opcion[];
  respuesta_usuario?: any;
}

@Component({
  selector: 'app-realizar-evaluacion',
  standalone: true,
  templateUrl: './realizar-evaluacion.component.html',
  styleUrls: ['./realizar-evaluacion.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatRadioModule,
    MatSliderModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatInputModule,
    MatSelectModule
  ]
})
export class RealizarEvaluacionComponent implements OnInit {
  evaluacion: any;
  preguntas: Pregunta[] = [];
  nna: any;
  cargando = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private ejecucionService: EjecucionInstrumentosService
  ) {}

  ngOnInit(): void {
    this.cargando = true;

    const evaluacionId = Number(this.route.snapshot.paramMap.get('id'));
    const nnaId = this.route.snapshot.paramMap.get('nnaId');

    this.ejecucionService.getDetalleEvaluacion(evaluacionId).subscribe(resp => {
      this.evaluacion = {
        id: resp.id,
        nombre: resp.nombre,
        plan_nombre: resp.plan_nombre,
        linea_nombre: resp.linea_nombre
      };

      this.preguntas = resp.preguntas || [];

      this.preguntas.forEach(p => {
        // Default a tipo texto si no existe
        if (!p.tipo) {
          p.tipo = { tipo: 'texto', id: -1 };
        }
        this.normalizaOpciones(p);
      });

      this.nna = { id: nnaId };
      this.cargando = false;
    });
  }

  private normalizaOpciones(p: Pregunta): void {
    if (!p.opciones || !p.opciones.length) {
      switch (p.tipo?.tipo) {
        case 'si_no':
          p.opciones = [
            { id: -1, label: 'Sí', valor: null },
            { id: -2, label: 'No', valor: null }
          ];
          break;

        case 'si_no_noestoyseguro':
          p.opciones = [
            { id: -1, label: 'Sí', valor: null },
            { id: -2, label: 'No', valor: null },
            { id: -3, label: 'No estoy seguro', valor: null }
          ];
          break;

        case '5emojis':
          p.opciones = [
            { id: -1, label: '😞', valor: 1 },
            { id: -2, label: '🙁', valor: 2 },
            { id: -3, label: '😐', valor: 3 },
            { id: -4, label: '🙂', valor: 4 },
            { id: -5, label: '😀', valor: 5 }
          ];
          break;

        case 'likert':
          p.opciones = [
            { id: -1, label: 'Muy en desacuerdo', valor: 1 },
            { id: -2, label: 'En desacuerdo', valor: 2 },
            { id: -3, label: 'Neutral', valor: 3 },
            { id: -4, label: 'De acuerdo', valor: 4 },
            { id: -5, label: 'Muy de acuerdo', valor: 5 }
          ];
          break;

        default:
          p.opciones = []; // No se asigna nada si no es un tipo conocido
      }
    }
  }

guardarRespuestas(): void {
  if (!this.nna?.id || !this.evaluacion?.id) return;

  const payload = {
    nna_id: this.nna.id,
    evaluacion_id: this.evaluacion.id,
    respuestas: this.preguntas
      .filter(p => p.respuesta_usuario !== null && p.respuesta_usuario !== undefined)
      .map(p => {
        const esTextoLibre = !p.opciones?.length;
        const esIdValido = !esTextoLibre && p.respuesta_usuario > 0;

        return {
          pregunta_id: p.id,
          tipo: p.tipo?.tipo || 'texto',
          respuesta_opcion_id: esIdValido ? p.respuesta_usuario : null,
          respuesta_texto: esTextoLibre ? p.respuesta_usuario : null,
          subpregunta_id: null
        };
      })
  };

  this.http.post('/api/evaluaciones/respuestas-parciales', payload).subscribe({
    next: () => {
      alert('Respuestas guardadas correctamente');
    },
    error: err => {
      console.error(err);
      alert('Error al enviar respuestas');
    }
  });
}

guardarRespuestaParcial(p: Pregunta): void {
  if (!this.nna?.id || !this.evaluacion?.id) return;

  const esTextoLibre = !p.opciones?.length;
  const esIdValido = !esTextoLibre && p.respuesta_usuario > 0;

  const payload = {
    nna_id: this.nna.id,
    evaluacion_id: this.evaluacion.id,
    respuestas: [{
      pregunta_id: p.id,
      tipo: p.tipo?.tipo || 'texto',
      respuesta_opcion_id: esIdValido ? p.respuesta_usuario : null,
      respuesta_texto: esTextoLibre ? p.respuesta_usuario : null,
      subpregunta_id: null
    }]
  };

  this.ejecucionService.guardarRespuestaParcial(payload).subscribe({
    next: () => console.log(`Respuesta de la pregunta ${p.id} guardada.`),
    error: err => console.error(`Error al guardar respuesta parcial de pregunta ${p.id}`, err)
  });
}


  volver(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
