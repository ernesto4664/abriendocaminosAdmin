import { Component, OnInit, inject } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { RespuestasService } from '../../../services/respuestas.service';
import { PlanesIntervencionService } from '../../../services/plan-intervencion.service';
import { CommonModule } from '@angular/common';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-respuesta',
  standalone: true,
  imports: [
    CommonModule,ReactiveFormsModule,MatRadioModule, FormsModule, MatSliderModule, MatButtonModule, MatFormFieldModule, MatSelectModule
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
  private fb = inject(FormBuilder);
  private PlanesIntervencionService = inject(PlanesIntervencionService);
  private respuestaService = inject(RespuestasService);

  constructor() {
    this.miFormulario = new FormGroup({
      plan_id: new FormControl('', Validators.required),
      evaluacion_id: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    this.inicializarFormulario();
    this.cargarPlanes();
  }

  /** 📌 Inicializar formulario */
  inicializarFormulario() {
    this.respuestaForm = this.fb.group({
      plan_id: [''],
      evaluacion_id: ['']
    });
  }

  /** 📌 Cargar planes de intervención */
  cargarPlanes() {
    this.PlanesIntervencionService.getPlanes().subscribe({
      next: (data) => {
        this.planes = data;
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
      this.PlanesIntervencionService.getEvaluacionesConPreguntas(planId).subscribe({
        next: (data) => {
          this.evaluaciones = data.evaluaciones;
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
      if (evaluacion) {
        this.preguntas = evaluacion.preguntas;

        // Inicializar respuestas y observaciones
        this.preguntas.forEach(pregunta => {
          this.respuestas[pregunta.id] = [];
          this.observaciones[pregunta.id] = new FormControl('');
        });
      }
    }
  }

    /** 📌 Agregar escala Likert editable */
    agregarEscalaLikertEditable(preguntaId: number) {
      if (!this.respuestas[preguntaId]) {
        this.respuestas[preguntaId] = [];
      }

      this.respuestas[preguntaId].push({
        tipo: 'likert',
        subpreguntas: [
          { texto: '', opciones: this.obtenerOpcionesLikert() }
        ]
      });
    }

    /** 📌 Obtener opciones por defecto para la Escala Likert */
    obtenerOpcionesLikert() {
      return [
        { label: 'No estoy de acuerdo', control: new FormControl('') },
        { label: 'Estoy un poco de acuerdo', control: new FormControl('') },
        { label: 'Estoy de acuerdo', control: new FormControl('') },
        { label: 'Estoy muy de acuerdo', control: new FormControl('') },
        { label: 'Estoy totalmente de acuerdo', control: new FormControl('') },
        { label: 'Si', control: new FormControl('') },
        { label: 'No', control: new FormControl('') },
        { label: 'No estoy seguro', control: new FormControl('') },
        { label: 'Nunca', control: new FormControl('') },
        { label: 'A menudo', control: new FormControl('') },
        { label: 'A veces', control: new FormControl('') },
        { label: 'Siempre', control: new FormControl('') },
        { label: 'Una vez', control: new FormControl('') },
        { label: 'Dos o tres veces', control: new FormControl('') },
        { label: 'Más de tres veces', control: new FormControl('') },
        { label: 'No sé', control: new FormControl('') }
      ];
    }

    /** 📌 Agregar nueva opción a la Escala Likert */
    agregarOpcionLikert(preguntaId: number, escala: any) {
      const nuevaOpcion = { label: 'Nueva Opción', control: new FormControl('') };

      // Agregar la nueva opción a todas las subpreguntas
      escala.subpreguntas.forEach((subpregunta: any) => {
        subpregunta.opciones.push(nuevaOpcion);
      });
    }

    /** 📌 Editar texto de una opción de la Escala Likert */
    editarOpcionLikert(opcion: any, nuevoValor: string) {
      opcion.label = nuevoValor;
    }

    /** 📌 Eliminar una opción de la Escala Likert */
    eliminarOpcionLikert(subpregunta: any, opcion: any) {
      subpregunta.opciones = subpregunta.opciones.filter((opt: any) => opt !== opcion);
    }

    /** 📌 Agregar una nueva subpregunta manteniendo las opciones previas */
    agregarSubPreguntaLikert(preguntaId: number, escala: any) {
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
      escala.subpreguntas = escala.subpreguntas.filter((sp: any) => sp !== subpregunta);
    }

  /** 📌 Guardar respuestas */
  guardarRespuestas() {
    const respuestasFinales: any[] = [];

    for (const preguntaId in this.respuestas) {
      this.respuestas[preguntaId].forEach(respuesta => {
        let valor = null;

        if (respuesta.tipo === 'likert') {
          valor = respuesta.opciones.map((op: { label: any; control: { value: any; }; }) => ({ label: op.label, valor: op.control.value }));
        }

        respuestasFinales.push({
          pregunta_id: preguntaId,
          tipo: respuesta.tipo,
          valor,
          observaciones: this.observaciones[preguntaId].value
        });
      });
    }

    this.respuestaService.createRespuesta(respuestasFinales).subscribe({
      next: () => {
        alert('✅ Respuestas guardadas correctamente');
        this.respuestas = {};
        this.observaciones = {};
      },
      error: (err) => console.error('❌ Error al guardar respuestas:', err),
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
    this.respuestas[preguntaId].push({ tipo: 'barra_satisfaccion', valor: new FormControl(5) }); // Inicia en 5
  }

  /** 📌 Agregar Opción Sí/No */
  agregarOpcionSiNo(preguntaId: number) {
    if (!this.respuestas[preguntaId]) {
      this.respuestas[preguntaId] = [];
    }
    this.respuestas[preguntaId].push({
      tipo: 'si_no',
      valor: new FormControl('') // Se inicializa sin valor
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

    /** 📌 Eliminar una respuesta agregada */
  eliminarRespuesta(preguntaId: number, respuesta: any) {
    this.respuestas[preguntaId] = this.respuestas[preguntaId].filter(res => res !== respuesta);
  }

/** 📌 Convertir respuesta de texto en opción */
convertirASeleccion(preguntaId: number, respuesta: any) {
  if (respuesta.valor.trim() !== '') {
    respuesta.tipo = 'opcion';
    respuesta.texto = respuesta.valor;
  }
}

/** 📌 Agregar Input Numérico */
agregarInputNumerico(preguntaId: number) {
  if (!this.respuestas[preguntaId]) {
    this.respuestas[preguntaId] = [];
  }
  this.respuestas[preguntaId].push({ tipo: 'numero', valor: '' });
}

convertirATipoOpcion(preguntaId: number, respuesta: any) {
  if (!respuesta.valor || respuesta.valor.trim() === '') {
    alert("⚠️ Debes ingresar un texto antes de convertirlo en una opción.");
    return;
  }

  // Convertir la respuesta en una opción de tipo radio button
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
