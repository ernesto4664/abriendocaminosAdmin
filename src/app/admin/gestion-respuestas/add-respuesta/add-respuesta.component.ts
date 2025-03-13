import { Component, OnInit, TrackByFunction, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RespuestasService } from '../../../services/respuestas.service';
import { PlanesIntervencionService } from '../../../services/plan-intervencion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-respuesta',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatRadioModule,
    MatSliderModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './add-respuesta.component.html',
  styleUrl: './add-respuesta.component.scss',
})
export class AddRespuestaComponent implements OnInit {
  respuestaForm!: FormGroup;
  planes: any[] = [];
  evaluaciones: any[] = [];
  preguntas: any[] = [];
  respuestas: { [preguntaId: number]: any[] } = {};
  observaciones: { [preguntaId: number]: FormControl } = {};
  miFormulario: FormGroup;

  private fb: FormBuilder = inject(FormBuilder);
  private PlanesIntervencionService = inject(PlanesIntervencionService);
  private respuestaService = inject(RespuestasService);
  trackById!: TrackByFunction<any>;
  trackByPregunta!: TrackByFunction<any>;
  trackByRespuesta!: TrackByFunction<any>;
  trackBySubPregunta!: TrackByFunction<any>;
  trackByOpcion!: TrackByFunction<any>;

  constructor(private router: Router) {
    this.miFormulario = this.fb.group({
      plan_id: ['', Validators.required],
      evaluacion_id: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.inicializarFormulario();
    this.cargarPlanes();
  }

  /** 📌 Inicializar formulario */
  inicializarFormulario() {
    this.respuestaForm = this.fb.group({
      plan_id: ['', Validators.required],
      evaluacion_id: ['', Validators.required]
    });
  }

  /** 📌 Cargar planes de intervención */
  cargarPlanes() {
    this.PlanesIntervencionService.getPlanes().subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.planes = data;
          console.log('✅ Planes obtenidos:', this.planes);
        } else {
          console.error('⚠️ La respuesta no es un array:', data);
        }
      },
      error: (err) => console.error('❌ Error al cargar planes:', err),
    });
  }

/** 📌 Cargar evaluaciones al seleccionar un plan */
cargarEvaluaciones(planId: number) {
  this.evaluaciones = [];
  this.preguntas = [];
  this.respuestas = {};

  if (planId) {
    this.PlanesIntervencionService.getEvaluacionesSinRespuestas(planId).subscribe({
      next: (data) => {
        this.evaluaciones = data.evaluaciones || [];
        console.log('✅ Evaluaciones filtradas:', this.evaluaciones);
      },
      error: (err) => console.error('❌ Error al cargar evaluaciones:', err),
    });
  }
}

  /** 📌 Cargar preguntas al seleccionar una evaluación */
  cargarPreguntas(evaluacionId: number) {
    this.preguntas = [];
    this.respuestas = {};
    this.observaciones = {};

    if (evaluacionId) {
      const evaluacion = this.evaluaciones.find(e => e.id === evaluacionId);
      if (evaluacion && Array.isArray(evaluacion.preguntas)) {
        this.preguntas = evaluacion.preguntas;
        this.preguntas.forEach(pregunta => {
          this.respuestas[pregunta.id] = [];
          this.observaciones[pregunta.id] = new FormControl('');
        });
        console.log('✅ Preguntas cargadas:', this.preguntas);
      } else {
        console.warn('⚠️ No hay preguntas disponibles para la evaluación seleccionada.');
      }
    }
  }

  /** 📌 Agregar escala Likert editable */
  agregarEscalaLikertEditable(preguntaId: number) {
    if (!this.respuestas[preguntaId]) {
      this.respuestas[preguntaId] = [];
    }

    const escalaLikert = this.respuestas[preguntaId].find(res => res.tipo === 'likert');
    
    if (!escalaLikert) {
      this.respuestas[preguntaId].push({
        tipo: 'likert',
        subpreguntas: [
          { texto: '', opciones: this.obtenerOpcionesLikert() }
        ]
      });
    } else {
      console.warn(`⚠️ La pregunta ${preguntaId} ya tiene una escala Likert.`);
    }
  }

  /** 📌 Obtener opciones por defecto para la Escala Likert */
  obtenerOpcionesLikert() {
    return [
      { label: 'No estoy de acuerdo', control: new FormControl('') },
      { label: 'Estoy un poco de acuerdo', control: new FormControl('') },
      { label: 'Estoy de acuerdo', control: new FormControl('') },
      { label: 'Estoy muy de acuerdo', control: new FormControl('') },
      { label: 'Estoy totalmente de acuerdo', control: new FormControl('') },
      { label: 'Sí', control: new FormControl('') },
      { label: 'No', control: new FormControl('') },
      { label: 'No es cierto', control: new FormControl('') },
      { label: 'En cierta manera o algunas veces', control: new FormControl('') },
      { label: 'Muy cierto o a menudo es cierto', control: new FormControl('') },
      { label: 'No estoy seguro/a', control: new FormControl('') },
      { label: 'Nunca', control: new FormControl('') },
      { label: 'A menudo', control: new FormControl('') },
      { label: 'A veces', control: new FormControl('') },
      { label: 'Siempre', control: new FormControl('') },
      { label: 'Una vez', control: new FormControl('') },
      { label: 'Dos o tres veces', control: new FormControl('') },
      { label: 'Más de tres veces', control: new FormControl('') },
      { label: 'No sé / No aplica', control: new FormControl('') },
      { label: 'No sé', control: new FormControl('') }
    ];
  }

  /** 📌 Agregar nueva opción a la Escala Likert */
  agregarOpcionLikert(preguntaId: number, escala: any) {
    if (!escala || !Array.isArray(escala.subpreguntas)) {
      console.error(`❌ No se encontró la escala para la pregunta ${preguntaId}.`);
      return;
    }

    const nuevaOpcion = { label: 'Nueva Opción', control: new FormControl('') };

    escala.subpreguntas.forEach((subpregunta: any) => {
      if (Array.isArray(subpregunta.opciones)) {
        subpregunta.opciones.push(nuevaOpcion);
      }
    });
  }

  /** 📌 Editar texto de una opción de la Escala Likert */
  editarOpcionLikert(opcion: any, nuevoValor: string) {
    if (!nuevoValor.trim()) {
      console.warn('⚠️ El nuevo valor no puede estar vacío.');
      return;
    }
    opcion.label = nuevoValor;
  }

  /** 📌 Eliminar una opción de la Escala Likert */
  eliminarOpcionLikert(subpregunta: any, opcion: any) {
    if (!subpregunta || !Array.isArray(subpregunta.opciones)) {
      console.error('❌ No se puede eliminar la opción, la subpregunta no es válida.');
      return;
    }

    subpregunta.opciones = subpregunta.opciones.filter((opt: any) => opt !== opcion);
  }

  /** 📌 Agregar una nueva subpregunta manteniendo las opciones previas */
  agregarSubPreguntaLikert(preguntaId: number, escala: any) {
    if (!escala || !Array.isArray(escala.subpreguntas) || escala.subpreguntas.length === 0) {
      console.error(`❌ No se pueden agregar subpreguntas, la escala de la pregunta ${preguntaId} no tiene opciones.`);
      return;
    }

    escala.subpreguntas.push({
      texto: '',
      opciones: escala.subpreguntas[0].opciones.map((opcion: any) => ({
        label: opcion.label,
        control: new FormControl('')
      }))
    });
  }

  /** 📌 Eliminar una subpregunta específica dentro de la Escala Likert */
  eliminarSubPreguntaLikert(preguntaId: number, escala: any, subpregunta: any) {
    if (!escala || !Array.isArray(escala.subpreguntas)) {
      console.error(`❌ No se puede eliminar la subpregunta, la escala de la pregunta ${preguntaId} no es válida.`);
      return;
    }

    escala.subpreguntas = escala.subpreguntas.filter((sp: any) => sp !== subpregunta);
  }

    /** 📌 Guardar respuestas */
    guardarRespuestas() {
      const requestBody = {
        evaluacion_id: this.miFormulario.get('evaluacion_id')?.value
          ? Number(this.miFormulario.get('evaluacion_id')?.value)
          : null,
    
        respuestas: this.preguntas.map((pregunta) => {
          const respuesta = this.respuestas[pregunta.id]?.[0];
    
          return {
            pregunta_id: pregunta.id ? Number(pregunta.id) : null,  // ✅ Asegurar `pregunta_id`
            tipo: respuesta?.tipo ?? null,
            respuesta: respuesta?.valor !== undefined && respuesta?.valor !== null
              ? String(respuesta.valor)
              : null,
            observaciones: respuesta?.observaciones ?? null,
            opciones: respuesta?.opciones?.length ? respuesta.opciones : null,
            subpreguntas: respuesta?.subpreguntas?.length ? respuesta.subpreguntas : null
          };
        }).filter((r) => r.pregunta_id !== null && r.tipo !== null) // ✅ Filtrar respuestas inválidas
      };
    
      console.log("📤 Enviando datos a la API:", JSON.stringify(requestBody, null, 2));
    
      if (!requestBody.evaluacion_id) {
        console.error("❌ Error: `evaluacion_id` no puede ser null.");
        return;
      }
    
      if (requestBody.respuestas.length === 0) {
        console.error("❌ Error: No hay respuestas válidas para enviar.");
        return;
      }
    
      // Asegurarte de pasar las respuestas de manera adecuada:
      // Cambia esto si 'this.respuestas' no es un array.
      const respuestasFormateadas = Object.values(this.respuestas).flat(); // Convertir en un array plano
    
      this.respuestaService.guardarRespuestas(requestBody, respuestasFormateadas).subscribe({
        next: (response: any) => {
          console.log("✅ Respuestas guardadas con éxito", response);
          this.router.navigate(['admin/gestion-respuestas/listar']); // ✅ Redirección después de éxito
        },
        error: (error: any) => {
          console.error("❌ Error al guardar respuestas:", error);
        }
      });
    }
    
     
    /** 📌 Agregar Respuesta de Texto */
    agregarRespuestaTexto(preguntaId: number) {
      if (!this.respuestas[preguntaId]) {
        this.respuestas[preguntaId] = [];
      }
      this.respuestas[preguntaId].push({ tipo: 'texto', valor: '' });
    }

    /** 📌 Agregar Barra de Satisfacción */
    agregarBarraSatisfaccion(preguntaId: number) {
      if (!this.respuestas[preguntaId]) {
        this.respuestas[preguntaId] = [];
      }
      this.respuestas[preguntaId].push({ tipo: 'barra_satisfaccion', valor: 5 }); // Inicializa con valor por defecto
    }

    /** 📌 Agregar Opción Sí/No */
    agregarOpcionSiNo(preguntaId: number) {
      if (!this.respuestas[preguntaId]) {
        this.respuestas[preguntaId] = [];
      }
      this.respuestas[preguntaId].push({
        tipo: 'si_no',
        valor: ''
      });
    }

    /** 📌 Agregar Opción Sí/No/No estoy seguro */
    agregarOpcionSiNoNoEstoySeguro(preguntaId: number) {
      if (!this.respuestas[preguntaId]) {
        this.respuestas[preguntaId] = [];
      }

      this.respuestas[preguntaId].push({
        tipo: 'si_no_noestoyseguro',
        valor: '',
        opciones: [
          { label: 'Sí', value: 'si' },
          { label: 'No', value: 'no' },
          { label: 'No estoy seguro', value: 'no_estoy_seguro' }
        ]
      });
    }

    /** 📌 Agregar Opción de 5 Emojis */
    agregarOpcion5emojis(preguntaId: number) {
      if (!this.respuestas[preguntaId]) {
        this.respuestas[preguntaId] = [];
      }

      this.respuestas[preguntaId].push({
        tipo: '5emojis',
        valor: '',
        opciones: [
          { label: 'Emoji 1', value: 'Emoji 1' },
          { label: 'Emoji 2', value: 'Emoji 2' },
          { label: 'Emoji 3', value: 'Emoji 3' },
          { label: 'Emoji 4', value: 'Emoji 4' },
          { label: 'Emoji 5', value: 'Emoji 5' }
        ]
      });
    }

    /** 📌 Eliminar una respuesta agregada */
    eliminarRespuesta(preguntaId: number, respuesta: any) {
      if (!this.respuestas[preguntaId] || !Array.isArray(this.respuestas[preguntaId])) {
        console.warn(`⚠️ No se encontró la respuesta para la pregunta ${preguntaId}.`);
        return;
      }
      this.respuestas[preguntaId] = this.respuestas[preguntaId].filter(res => res !== respuesta);
    }

    /** 📌 Convertir respuesta de texto en opción */
    convertirASeleccion(preguntaId: number, respuesta: any) {
      if (!respuesta.valor || !respuesta.valor.trim()) {
        console.warn("⚠️ No se puede convertir una respuesta vacía.");
        return;
      }
      respuesta.tipo = 'opcion';
      respuesta.texto = respuesta.valor;
    }

    /** 📌 Agregar Input Numérico */
    agregarInputNumerico(preguntaId: number) {
      if (!this.respuestas[preguntaId]) {
        this.respuestas[preguntaId] = [];
      }
      this.respuestas[preguntaId].push({ tipo: 'numero', valor: '' });
    }

    /** 📌 Convertir texto a una opción seleccionable */
    convertirATipoOpcion(preguntaId: number, respuesta: any) {
      if (!respuesta.valor || !respuesta.valor.trim()) {
        alert("⚠️ Debes ingresar un texto antes de convertirlo en una opción.");
        return;
      }

      this.respuestas[preguntaId] = this.respuestas[preguntaId].map(r => {
        if (r === respuesta) {
          return {
            tipo: 'opcion',
            opciones: [
              { label: respuesta.valor, control: new FormControl('') }
            ]
          };
        }
        return r;
      });
    }

}