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
  [x: string]: any;
  private fb = inject(FormBuilder);
  private respuestasService = inject(RespuestasService);
  private planesIntervencionService = inject(PlanesIntervencionService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  evaluacion: any;
  edicionActiva: { [preguntaId: number]: boolean } = {};
  valoresOriginales: { [preguntaId: number]: any } = {};
  respuestaForm!: FormGroup;
  evaluacionId!: number;
  preguntas: any[] = [];
  respuestas: { [preguntaId: number]: any[] } = {};
  observaciones: { [preguntaId: number]: FormControl } = {};
 
  requestBody: any = {};    // El cuerpo de la solicitud


  ngOnInit() {
    // Capturamos el ID de la evaluación desde la URL
    this.evaluacionId = Number(this.route.snapshot.params['id']);
    this.inicializarFormulario();
    this.cargarPreguntasYRespuestas();
  }
  
  cargarPreguntasYRespuestas() {
    this.respuestasService.getEvaluacionCompleta(this.evaluacionId).subscribe({
      next: (data) => {
        // Suponiendo que 'data' tiene las preguntas y respuestas necesarias
        this.preguntas = data.preguntas || [];
        this.evaluacion = data; // Si 'data' tiene el objeto completo de la evaluación
        console.log('Evaluación cargada:', this.evaluacion);
      },
      error: (err) => {
        console.error('Error al cargar la evaluación completa:', err);
      }
    });
  }
  

  inicializarFormulario() {
    this.respuestaForm = this.fb.group({
      evaluacion_id: [this.evaluacionId]
    });
  }
  
  habilitarEdicion(preguntaId: number) {
    this.valoresOriginales[preguntaId] = JSON.parse(JSON.stringify(this.respuestas[preguntaId]));
    this.edicionActiva[preguntaId] = true;
  
    this.respuestas[preguntaId].forEach(respuesta => {
      if (respuesta.tipo === 'likert') {
        // Verificar si ya existen subpreguntas antes de agregar nuevas
        if (!respuesta.subpreguntas || respuesta.subpreguntas.length === 0) {
          respuesta.subpreguntas = [{
            texto: '',
            opciones: this.obtenerOpcionesLikert()
          }];
        }
      }
    });
  
    console.log('🔹 Edición activada para la pregunta', preguntaId);
  }
  
  cancelarEdicion(preguntaId: number) {
    this.respuestas[preguntaId] = JSON.parse(JSON.stringify(this.valoresOriginales[preguntaId]));
    this.edicionActiva[preguntaId] = false;
  
    console.log('🔄 Edición cancelada. Respuestas restauradas para la pregunta', preguntaId);
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
      this.respuestas[preguntaId].push({ tipo: 'barra_satisfaccion', valor: '' });
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
        { label: 'No estoy de acuerdo', value: 'no_acuerdo' },
        { label: 'Estoy un poco de acuerdo', value: 'poco_acuerdo' },
        { label: 'Estoy de acuerdo', value: 'acuerdo' },
        { label: 'Estoy muy de acuerdo', value: 'muy_acuerdo' },
        { label: 'Estoy totalmente de acuerdo', value: 'total_acuerdo' },
        { label: 'Sí', value: 'si' },
        { label: 'No', value: 'no' },
        { label: 'No es cierto', value: 'no_es_ci' },
        { label: 'En cierta manera o algunas veces', value: 'cierta_manera' },
        { label: 'Muy cierto o a menudo es cierto', value: 'muy_cierto' },
        { label: 'No estoy seguro/a', value: 'no_seguro' },
        { label: 'Nunca', value: 'nunca' },
        { label: 'A menudo', value: 'a_menudo' },
        { label: 'A veces', value: 'a_veces' },
        { label: 'Siempre', value: 'siempre' },
        { label: 'Una vez', value: 'una_vez' },
        { label: 'Dos o tres veces', value: 'dos_tres' },
        { label: 'Más de tres veces', value: 'mas_tres' },
        { label: 'No sé / No aplica', value: 'no_se_aplica' },
        { label: 'No sé', value: 'no_se' }
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

      agregarSubPreguntaLikert(preguntaId: number, respuesta: any) {
        if (!respuesta.subpreguntas) {
          respuesta.subpreguntas = [];
        }
      
        // Creamos la nueva subpregunta con el tipo correcto
        const nuevaSubPregunta: { texto: string; opciones: { label: string; value: string }[] } = {
          texto: '',
          opciones: []
        };
      
        // Verificamos si ya existe una subpregunta con el mismo texto vacío
        const existeSubPregunta = respuesta.subpreguntas.some((sub: { texto: string }) => sub.texto === nuevaSubPregunta.texto);
        
        if (!existeSubPregunta) {
          // Si no tiene opciones, las llenamos con todas las disponibles
          nuevaSubPregunta.opciones = this.obtenerOpcionesLikert();
      
          // Agregamos la subpregunta
          respuesta.subpreguntas.push(nuevaSubPregunta);
        }
      }
      
      /** 📌 Eliminar una subpregunta específica dentro de la Escala Likert */
      eliminarSubPreguntaLikert(preguntaId: number, escala: any, subpregunta: any) {
        if (!escala || !Array.isArray(escala.subpreguntas)) {
          console.error(`❌ No se puede eliminar la subpregunta, la escala de la pregunta ${preguntaId} no es válida.`);
          return;
        }
    
        escala.subpreguntas = escala.subpreguntas.filter((sp: any) => sp !== subpregunta);
      }
  
      /** 📌 Mostrar confirmación y eliminar respuesta */
      confirmarEliminarRespuesta(respuestaId: number, preguntaId: number) {
        if (confirm('¿Estás seguro de que deseas eliminar esta respuesta? Esta acción no se puede deshacer.')) {
          this.eliminarRespuesta(respuestaId, preguntaId);
        }
      }

      /** 📌 Eliminar una respuesta en la API y en la UI */
      eliminarRespuesta(respuestaId: number, preguntaId: number) {
        this.respuestasService.eliminarRespuesta(respuestaId).subscribe({
          next: () => {
            // ❌ Eliminar respuesta localmente sin recargar
            this.respuestas[preguntaId] = this.respuestas[preguntaId].filter(res => res.id !== respuestaId);
            alert('Respuesta eliminada con éxito');
          },
          error: (error) => {
            console.error('Error al eliminar la respuesta:', error);
            alert('Hubo un problema al eliminar la respuesta.');
          }
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
  
        
      /** 📌 Agregar Input Numérico */
      agregarInputNumerico(preguntaId: number) {
        if (!this.respuestas[preguntaId]) {
          this.respuestas[preguntaId] = [];
        }
        this.respuestas[preguntaId].push({ tipo: 'numero', valor: '' });
      }
  
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
                { label: respuesta.valor, value: respuesta.valor } // Se mantiene la estructura esperada
              ],
              valor: '' // ⚠️ Asegura que inicialmente no tenga valor seleccionado
            };
          }
          return r;
        });
      
        console.log("Respuestas actualizadas: ", this.respuestas[preguntaId]); // Depuración
      }

      guardarEdicion(preguntaId: number, respuesta: any) {
        console.log(`Guardando edición para pregunta ${preguntaId}:`, respuesta);
      
        // Validar si realmente hubo cambios antes de guardar
        const index = this.respuestas[preguntaId].findIndex(r => r === respuesta);
        if (index !== -1) {
          this.respuestas[preguntaId][index] = { ...respuesta }; // Reemplaza sin afectar otras respuestas
        }
      
        // Desactivar edición solo si se hizo un cambio
        this.edicionActiva[preguntaId] = false;
      
        console.log("✅ Respuesta actualizada:", this.respuestas);
      }
      
      guardarRespuestas() {
        console.log("📤 Guardando todas las respuestas...");
        
        const requestBody = {
          evaluacion_id: this.evaluacionId,
          respuestas: [] as Array<{
            id?: number | string;
            pregunta_id: number;
            tipo: string;
            respuesta: string;
            opciones: any[] | null;
            subpreguntas: any[] | null;
            evaluacion_id?: number;
          }>
        };
      
        // Recorrer las respuestas correctamente
        Object.entries(this.respuestas).forEach(([preguntaId, respuestasArray]) => {
          if (Array.isArray(respuestasArray)) {
            respuestasArray.forEach(respuesta => {
              if (!respuesta.id) {
                console.warn(`⚠️ Pregunta ${preguntaId} sin ID de respuesta, generando uno temporal.`);
                respuesta.id = `temp-${preguntaId}-${Date.now()}`;
              }
      
              // Aseguramos que las opciones y subpreguntas sean arrays
              const opciones = respuesta.opciones || [];
              const subpreguntas = respuesta.subpreguntas || [];
      
              requestBody.respuestas.push({
                id: respuesta.id,
                pregunta_id: parseInt(preguntaId, 10), // Aseguramos que el ID sea un número
                tipo: respuesta.tipo,
                respuesta: respuesta.valor || "",
                opciones: opciones.length > 0 ? opciones : null,
                subpreguntas: subpreguntas.length > 0 ? subpreguntas : null,
                evaluacion_id: this.evaluacionId // Aseguramos que siempre se envíe
              });
            });
          }
        });
      
        console.log("📤 Enviando datos a la API:", JSON.stringify(requestBody, null, 2));
      
        if (requestBody.respuestas.length === 0) {
          console.error("❌ No hay respuestas válidas para enviar.");
          return;
        }
      
        // Llamamos al servicio con ambos parámetros (requestBody y respuestas)
        this.respuestasService.guardarRespuestas(requestBody, Object.values(this.respuestas)).subscribe({
          next: (response) => {
            console.log("✅ Respuestas guardadas exitosamente:", response);
            this.router.navigate(['admin/gestion-respuestas/listar']);
          },
          error: (err) => {
            console.error("❌ Error al guardar las respuestas:", err);
          }
        });
      }
                         
}

