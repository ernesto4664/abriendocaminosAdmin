import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { RespuestasService } from '../../../services/respuestas.service';
import { PlanesIntervencionService } from '../../../services/plan-intervencion.service';

@Component({
  selector: 'app-edit-respuesta',
  standalone: true,
  imports: [
    CommonModule,
    MatRadioModule,
    MatRadioModule,
    MatSliderModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './edit-respuesta.component.html',
  styleUrl: './edit-respuesta.component.scss'
})
export class EditRespuestaComponent implements OnInit {
  private fb = inject(FormBuilder);
  private respuestasService = inject(RespuestasService);
  private planesIntervencionService = inject(PlanesIntervencionService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  respuestaForm!: FormGroup;
  evaluacionId!: number;
  preguntas: any[] = [];
  respuestas: { [preguntaId: number]: any[] } = {};
  observaciones: { [preguntaId: number]: FormControl } = {};

  ngOnInit() {
    this.evaluacionId = Number(this.route.snapshot.params['id']);
    this.inicializarFormulario();
    this.cargarPreguntasYRespuestas();
  }

  /** 📌 Inicializar formulario */
  inicializarFormulario() {
    this.respuestaForm = this.fb.group({
      evaluacion_id: [this.evaluacionId]
    });
  }

  /** 📌 Cargar preguntas y respuestas existentes */
  cargarPreguntasYRespuestas() {
    this.respuestasService.getRespuestasPorEvaluacion(this.evaluacionId).subscribe({
      next: (data) => {
        this.preguntas = data.preguntas || [];
        this.respuestas = {};
        this.observaciones = {};

        this.preguntas.forEach(pregunta => {
          // Si la pregunta tiene respuestas, las carga; si no, inicializa vacías
          this.respuestas[pregunta.id] = pregunta.respuestas?.length ? [...pregunta.respuestas] : [];
          this.observaciones[pregunta.id] = new FormControl(pregunta.observaciones || '');
        });

        console.log('✅ Preguntas y respuestas cargadas:', this.preguntas);
      },
      error: (err) => console.error('❌ Error al cargar preguntas y respuestas:', err)
    });
  }

  /** 📌 Agregar una nueva respuesta de texto */
  agregarRespuestaTexto(preguntaId: number) {
    if (!this.respuestas[preguntaId]) {
      this.respuestas[preguntaId] = [];
    }
    this.respuestas[preguntaId].push({ tipo: 'texto', valor: '' });
  }

  /** 📌 Agregar barra de satisfacción */
  agregarBarraSatisfaccion(preguntaId: number) {
    if (!this.respuestas[preguntaId]) {
      this.respuestas[preguntaId] = [];
    }
    this.respuestas[preguntaId].push({ tipo: 'barra_satisfaccion', valor: 5 });
  }

  /** 📌 Agregar opción Sí/No */
  agregarOpcionSiNo(preguntaId: number) {
    if (!this.respuestas[preguntaId]) {
      this.respuestas[preguntaId] = [];
    }
    this.respuestas[preguntaId].push({ tipo: 'si_no', valor: '' });
  }

  /** 📌 Agregar Escala Likert */
  agregarEscalaLikertEditable(preguntaId: number) {
    if (!this.respuestas[preguntaId]) {
      this.respuestas[preguntaId] = [];
    }
    this.respuestas[preguntaId].push({
      tipo: 'likert',
      subpreguntas: [{ texto: '', opciones: this.obtenerOpcionesLikert() }]
    });
  }

  /** 📌 Obtener opciones para la escala Likert */
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

  /** 📌 Eliminar una respuesta */
  eliminarRespuesta(preguntaId: number, respuesta: any) {
    this.respuestas[preguntaId] = this.respuestas[preguntaId].filter(res => res !== respuesta);
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

  /** 📌 Guardar todas las respuestas */
  guardarRespuestas() {
    const requestBody = {
      evaluacion_id: this.evaluacionId,
      respuestas: this.preguntas.map(pregunta => {
        return {
          pregunta_id: pregunta.id,
          tipo: this.respuestas[pregunta.id]?.[0]?.tipo || null,
          respuesta: this.respuestas[pregunta.id]?.[0]?.valor || null,
          observaciones: this.observaciones[pregunta.id]?.value || null,
          opciones: this.respuestas[pregunta.id]?.[0]?.opciones || null,
          subpreguntas: this.respuestas[pregunta.id]?.[0]?.subpreguntas || null
        };
      }).filter(r => r.pregunta_id !== null && r.tipo !== null)
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

    this.respuestasService.updateRespuesta(this.evaluacionId, requestBody).subscribe({
      next: () => {
        console.log("✅ Respuestas actualizadas con éxito");
        this.router.navigate(['admin/gestion-respuestas/listar']);
      },
      error: (error) => {
        console.error("❌ Error al actualizar respuestas:", error);
      }
    });
  }
}
