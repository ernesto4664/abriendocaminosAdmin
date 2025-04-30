import { Component, OnInit, TrackByFunction, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RespuestasService } from '../../../services/respuestas.service';
import { PlanesIntervencionService } from '../../../services/plan-intervencion.service';
import { Router } from '@angular/router';

interface Respuesta {
  tipo: string;
  valor: string | number;
  observaciones: string;
  opciones: { id: string; label: string }[]; // Opciones deben ser un array de objetos con ID y label
  subpreguntas: any[]; // Puedes especificar mejor el tipo si conoces su estructura
}



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
  observaciones: { [preguntaId: number]: FormControl } = {};
  miFormulario: FormGroup;
  // Variable para mantener las respuestas y sus opciones
  respuestas: { [key: number]: { tipo: string, valor: string | number, observaciones: string, opciones: any[], subpreguntas: any[] }[] } = {};
  preguntaSeleccionada: number | null = null;
  // Variable para manejar la visibilidad del campo de texto
  mostrarRespuestaTexto: boolean = false;stas: { [key: number]: { tipo: string, valor: string | number, observaciones: string, opciones: any[], subpreguntas: any[] }[] } = {};


  private fb: FormBuilder = inject(FormBuilder);
  private PlanesIntervencionService = inject(PlanesIntervencionService);
  private respuestaService = inject(RespuestasService);
  trackById!: TrackByFunction<any>;
  trackByPregunta!: TrackByFunction<any>;
  trackByRespuesta!: TrackByFunction<any>;
  trackBySubPregunta!: TrackByFunction<any>;
  trackByOpcion!: TrackByFunction<any>;

  constructor(private router: Router, private cdr: ChangeDetectorRef) {
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

    const escalaLikert = this.respuestas[preguntaId].find((res: { tipo: string; }) => res.tipo === 'likert');
    
    if (!escalaLikert) {
      this.respuestas[preguntaId].push({
        tipo: 'likert',
        subpreguntas: [
          { texto: '', opciones: this.obtenerOpcionesLikert() }
        ],
        valor: '',
        observaciones: '',
        opciones: []
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
     
  // ✅ Agregar respuesta de tipo texto SIN DUPLICADOS
  agregarRespuestaTexto(preguntaId: number) {
    console.log('✅ Agregando respuesta de texto');

    if (!this.respuestas[preguntaId]) {
      this.respuestas[preguntaId] = [];
    }

    // 🛑 Elimina cualquier respuesta de tipo "texto" antes de agregar una nueva
    this.respuestas[preguntaId] = this.respuestas[preguntaId].filter(r => r.tipo !== 'texto');

    // ✅ Agrega un solo input de texto vacío
    this.respuestas[preguntaId].push({
      tipo: 'texto',
      valor: '',
      observaciones: '',
      opciones: [],
      subpreguntas: []
    });

    this.mostrarRespuestaTexto = true;
  }

    eliminarRespuesta(preguntaId: number, respuesta: any) {
      if (!this.respuestas[preguntaId] || !Array.isArray(this.respuestas[preguntaId])) {
        console.warn(`⚠️ No se encontró la respuesta para la pregunta ${preguntaId}.`);
        return;
      }
      
      // Eliminar la respuesta correspondiente
      this.respuestas[preguntaId] = this.respuestas[preguntaId].filter(res => res !== respuesta);
      console.log(`Respuesta eliminada para la pregunta ${preguntaId}`);
    }
    
          
    /** 📌 Agregar Barra de Satisfacción */
    agregarBarraSatisfaccion(preguntaId: number) {
      if (!this.respuestas[preguntaId]) {
        this.respuestas[preguntaId] = [];
      }
      this.respuestas[preguntaId].push({
        tipo: 'barra_satisfaccion', valor: '',
        observaciones: '',
        opciones: [],
        subpreguntas: []
      }); // Inicializa con valor por defecto
    }
    

    /** 📌 Agregar Opción Sí/No */
    agregarOpcionSiNo(preguntaId: number) {
      if (!this.respuestas[preguntaId]) {
        this.respuestas[preguntaId] = [];
      }
      this.respuestas[preguntaId].push({
        tipo: 'si_no',
        valor: '',
        observaciones: '',
        opciones: [],
        subpreguntas: []
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
        ],
        observaciones: '',
        subpreguntas: []
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
        ],
        observaciones: '',
        subpreguntas: []
      });
    }

    /** 📌 Agregar Input Numérico */
    agregarInputNumerico(preguntaId: number) {
      if (!this.respuestas[preguntaId]) {
        this.respuestas[preguntaId] = [];
      }
      this.respuestas[preguntaId].push({
        tipo: 'numero', valor: '',
        observaciones: '',
        opciones: [],
        subpreguntas: []
      });
    }

      /** 📌 Mostrar formulario de Opciones Personalizadas */
      mostrarFormularioOpcionesPersonalizadas(preguntaId: number) {
        this.preguntaSeleccionada = preguntaId;

        // Verificar si la pregunta ya tiene una respuesta de tipo "opcion_personalizada"
        if (!this.respuestas[preguntaId]?.some(res => res.tipo === 'opcion_personalizada')) {
          this.respuestas[preguntaId] = this.respuestas[preguntaId] || [];
          this.respuestas[preguntaId].push({
            tipo: "opcion_personalizada",
            valor: "",
            observaciones: "",
            opciones: [],
            subpreguntas: []
          });
        }
      }

      /** 📌 Agregar nueva opción personalizada */
      agregarOpcionPersonalizada(preguntaId: number) {
        const respuesta = this.respuestas[preguntaId]?.find(res => res.tipo === 'opcion_personalizada');

        if (!respuesta) {
          console.warn(`⚠️ No se encontró una respuesta de tipo "opcion_personalizada" en la pregunta ${preguntaId}.`);
          return;
        }

        respuesta.opciones.push({
          id: `temp-${Date.now()}`,
          label: ""
        });
      }

      /** 📌 Eliminar opción personalizada */
      eliminarOpcionPersonalizada(preguntaId: number, index: number) {
        const respuesta = this.respuestas[preguntaId]?.find(res => res.tipo === 'opcion_personalizada');

        if (respuesta && index >= 0 && index < respuesta.opciones.length) {
          respuesta.opciones.splice(index, 1);
        } else {
          console.warn(`⚠️ No se pudo eliminar la opción en la pregunta ${preguntaId}, índice inválido.`);
        }
      }

     
    /** 📌 Guardar respuestas */
    guardarRespuestas() {
      const evaluacionId = this.miFormulario.get('evaluacion_id')?.value ?? null;
    
      if (!evaluacionId) {
        console.error("❌ Error: `evaluacion_id` no puede ser null.");
        alert("Debes seleccionar una evaluación antes de guardar.");
        return;
      }
    
      const respuestasFiltradas = this.preguntas.flatMap(pregunta => {
        const respuestasDePregunta = this.respuestas[pregunta.id] ?? [];
    
        return respuestasDePregunta.map(respuesta => {
          let opcionesFinales: { label: any; valor: any; }[] = [];
          let subpreguntasFinales: { texto: any; opciones: any; }[] = [];
    
          // ✅ Procesar opciones según el tipo de respuesta
          if (respuesta.tipo === 'barra_satisfaccion') {
            opcionesFinales = [];  // No debe tener opciones
            subpreguntasFinales = [];  // No debe tener subpreguntas
          } else if (['5emojis', 'si_no', 'si_no_noestoyseguro', 'opcion_personalizada'].includes(respuesta.tipo)) {
            opcionesFinales = respuesta.opciones?.map(opcion => ({
              label: opcion.label ?? "Opción sin título",
              valor: opcion.valor ?? null
            })) ?? [];
          }
    
          // ✅ Procesar subpreguntas solo si el tipo es 'likert'
          if (respuesta.tipo === 'likert' && respuesta.subpreguntas?.length > 0) {
            subpreguntasFinales = respuesta.subpreguntas.map(subpregunta => ({
              texto: subpregunta.texto ?? "",
              opciones: subpregunta.opciones?.map((opcion: { label: any; }) => ({
                label: opcion.label ?? "Opción sin título"
              })) ?? []
            }));
          }
    
          return {
            pregunta_id: pregunta.id ?? null,
            tipo: respuesta.tipo ?? null,  // ✅ Mantiene el tipo correcto
            respuesta: respuesta.valor !== null && respuesta.valor !== undefined 
              ? String(respuesta.valor) 
              : null, // ✅ No enviamos "" si es null
            observaciones: respuesta.observaciones ?? "",
            opciones: opcionesFinales,
            subpreguntas: subpreguntasFinales
          };
        });
      });
    
      // ✅ Ahora enviamos los datos correctamente al backend
      const payload = {
        evaluacion_id: evaluacionId,
        respuestas: respuestasFiltradas
      };
    
      console.log("📤 Enviando datos a la API:", payload);
      this.respuestaService.guardarRespuestas(payload).subscribe(
        response => {
          console.log("✅ Respuestas guardadas correctamente:", response);
          alert("Respuestas guardadas con éxito.");
    
          // ✅ Redirección al listado después de guardar
          this.router.navigate(['/admin/gestion-respuestas/listar']);
        },
        error => {
          console.error("❌ Error en la API:", error);
          alert("Hubo un error al guardar las respuestas.");
        }
      );
    }
       
   
}