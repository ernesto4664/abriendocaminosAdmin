import { Component, OnInit, TrackByFunction, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { RespuestasService } from '../../../services/respuestas.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';

@Component({
  selector: 'app-edit-respuesta',
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
  templateUrl: './edit-respuesta.component.html',
  styleUrl: './edit-respuesta.component.scss',
})
export class EditRespuestaComponent implements OnInit {
  [x: string]: any;
  miFormulario!: FormGroup;
  evaluacion: any = {};
  preguntas: any[] = [];
  respuestas: { [key: number]: any[] } = {};
  edicionActiva: { [key: number]: boolean } = {};
  cargando: boolean = false;          // mientras carga la evaluación
  guardando: boolean = false; 
  // Variable para manejar la visibilidad del campo de texto
  mostrarRespuestaTexto: boolean = false;stas: { [key: number]: { tipo: string, valor: string | number, observaciones: string, opciones: any[], subpreguntas: any[] }[] } = {};

  private fb: FormBuilder = inject(FormBuilder);
  private respuestaService = inject(RespuestasService);
  private route = inject(ActivatedRoute);
 
  preguntaSeleccionada: number | undefined;
  respuestasOriginales: any;
  http: any;
  evaluacionId!: number;
  evaluaciones: any;

  constructor(private router: Router, private cdr: ChangeDetectorRef) {
    this.miFormulario = this.fb.group({
      evaluacion_id: ['', Validators.required]
    });
  }

  ngOnInit() {
    const param = this.route.snapshot.paramMap.get('id');
    if (param) {
      this.evaluacionId = parseInt(param, 10);    // ← guardamos el número
      this.cargarEvaluacion(this.evaluacionId);
    }
  }

  /** 📌 Cargar evaluación y sus respuestas */
cargarEvaluacion(evaluacionId: number) {
  // 1️⃣ Pongo el flag a true para deshabilitar UI mientras carga
  this.cargando = true;

  this.respuestaService.getEvaluacionCompleta(evaluacionId)
    .subscribe({
      next: (data) => {
        this.evaluacion = data;
        this.preguntas   = data.preguntas;
        this.respuestas  = {};

        this.preguntas.forEach((pregunta) => {
          if (!pregunta.respuestas) {
            pregunta.respuestas = [];
          }

          const tiposDetectados = pregunta.respuestas
            .map((r: any) => r.tipo)
            .filter(Boolean);

          if (!pregunta.tipos_de_respuesta?.length) {
            pregunta.tipos_de_respuesta = tiposDetectados.length
              ? [{ tipo: tiposDetectados[0] }]
              : [];
          }

          this.respuestas[pregunta.id] = pregunta.respuestas.map((respuesta: any) => ({
            id:           respuesta.id,
            tipo:         respuesta.tipo,
            valor:        respuesta.valor  ?? '',
            observaciones: respuesta.observaciones ?? '',
            opciones:     respuesta.opciones || [],
            subpreguntas: Array.isArray(respuesta.subpreguntas)
              ? respuesta.subpreguntas.map((sub: any) => ({
                  id:       sub.id,
                  texto:    sub.texto || '',
                  opciones: Array.isArray(sub.opciones)
                    ? sub.opciones.map((op: any) => ({
                        id:    op.id,
                        label: op.label,
                        value: op.valor ?? op.label
                      }))
                    : []
                }))
              : []
          }));
        });

        console.log('✅ Preguntas y respuestas cargadas:', this.preguntas);
      },
      error: (err) => {
        console.error('❌ Error al cargar la evaluación:', err);
        alert('⚠️ No se pudo cargar la evaluación. Revisa la consola.');
      },
      complete: () => {
        // 3️⃣ Siempre resetear el flag, con éxito o error
        this.cargando = false;
      }
    });
}
  
  private agruparSubpreguntasLikert(respuesta: any) {
    if (!Array.isArray(respuesta.subpreguntas) || !Array.isArray(respuesta.opciones_likert)) {
      return [];
    }
  
    const mapaSubpreguntas: { [key: number]: any } = {};
  
    respuesta.subpreguntas.forEach((sub: any) => {
      mapaSubpreguntas[sub.id] = {
        id: sub.id,
        texto: sub.texto || '',
        opciones: []
      };
    });
  
    respuesta.opciones_likert.forEach((op: any) => {
      if (mapaSubpreguntas[op.subpregunta_id]) {
        mapaSubpreguntas[op.subpregunta_id].opciones.push({
          id: op.id,
          label: op.label || '',
          value: op.value ?? op.label ?? '',
          control: new FormControl(op.label || '')
        });
      }
    });
  
    return Object.values(mapaSubpreguntas);
  }
  

  /** 📌 Habilitar edición */
  habilitarEdicion(preguntaId: number) {
    this.edicionActiva[preguntaId] = !this.edicionActiva[preguntaId];
  }

    /** 📌 Guardar cambios */

guardarCambios() {
  this.guardando = true;

  // 1️⃣ Filtramos solo las preguntas con respuestas modificadas (nuevas o editadas)
  const respuestasFiltradas = this.preguntas.flatMap(pregunta => {
    const respuestasPregunta = this.respuestas[pregunta.id] || [];

    return respuestasPregunta
      .filter(respuesta => !respuesta.eliminado) // Excluir eliminadas
      .filter(respuesta => {
        // Enviar solo si es nueva o se cambió tipo/opciones
        return (
          respuesta.id === null ||                         // respuesta nueva
          respuesta.tipo !== (pregunta.respuestas?.[0]?.tipo ?? null) || // cambio de tipo
          (respuesta.opciones?.length !== pregunta.respuestas?.[0]?.opciones?.length) // cambio de opciones
        );
      })
      .map(respuesta => {
        const opcionesLimpias = (respuesta.opciones ?? []).map((op: any) => ({
          id: (typeof op.id === 'number' || (typeof op.id === 'string' && !op.id.toString().startsWith('temp-')))
            ? op.id : null,
          label: op.label || '',
          value: op.value ?? op.label ?? ''
        }));

        const subpreguntasLimpias = (respuesta.subpreguntas ?? []).map((sp: any) => ({
          texto: sp.texto || '',
          opciones: (sp.opciones ?? []).map((op: any) => ({
            label: op.label || '',
            value: op.value ?? op.label ?? ''
          }))
        }));

        return {
          id: (typeof respuesta.id === 'number' && respuesta.id < 1_000_000) ? respuesta.id : null,
          pregunta_id: pregunta.id,
          tipo: respuesta.tipo,
          valor: respuesta.valor ?? '',
          observaciones: respuesta.observaciones ?? '',
          opciones: opcionesLimpias,
          subpreguntas: subpreguntasLimpias
        };
      });
  });

  if (!respuestasFiltradas.length) {
    alert("⚠️ No detectamos ningún cambio para guardar.");
    this.guardando = false;
    return;
  }

  const payload = {
    evaluacion_id: this.evaluacionId,
    respuestas: respuestasFiltradas
  };

  console.log("📤 Payload filtrado para actualizar:", payload);

  this.respuestaService.actualizarRespuestas(payload).subscribe({
    next: () => {
      alert("✅ Cambios guardados correctamente.");
      this.router.navigate(['/admin/gestion-respuestas/listar']);
    },
    error: (err) => {
      console.error("❌ Error al guardar respuestas:", err);
      if (err.status === 422 && err.error?.errors) {
        const msgs = Object.entries(err.error.errors)
          .map(([campo, m]: any) => `${campo}: ${m.join(', ')}`)
          .join('\n');
        alert(`⚠️ Errores de validación:\n${msgs}`);
      } else {
        alert("⚠️ Hubo un problema al guardar las respuestas. Revisa la consola.");
      }
    },
    complete: () => {
      this.guardando = false;
    }
  });
}

    
    
  private actualizarEvaluaciones() {
      this.http.get(`http://127.0.0.1:8000/api/v1/evaluaciones/${this.evaluacionId}/completa`)
          .subscribe({
              next: (updatedResponse: any) => {
                  this.evaluaciones = updatedResponse;
                  console.log("✅ Datos actualizados después de guardar:", this.evaluaciones);
              },
              error: (error: any) => {
                  console.error("❌ Error al recargar las evaluaciones:", error);
                  alert("⚠️ Se guardaron las respuestas, pero hubo un problema al actualizar los datos.");
              }
          });
  }
  

  cambiarTipoRespuesta(preguntaId: number, nuevoTipo: string) {
    const pregunta = this.preguntas.find(p => p.id === preguntaId);
    const respuestaAnterior = this.respuestas[preguntaId]?.[0];
  
    if (respuestaAnterior) {
      console.log(`🔄 Cambiando tipo de respuesta de ${respuestaAnterior.tipo} a ${nuevoTipo}`);
  
      const seCambiaTipo = respuestaAnterior.tipo !== nuevoTipo;
  
      if (seCambiaTipo) {
        const requiereReemplazo = respuestaAnterior.tipo === 'likert' || nuevoTipo === 'likert';
  
        if (requiereReemplazo) {
          // 🧹 Limpieza completa, se borra la anterior (ej. likert cambia su estructura)
          this.respuestas[preguntaId] = [{
            id: null, // 🔴 importante: null para que el backend cree una nueva
            pregunta_id: preguntaId,
            tipo: nuevoTipo,
            valor: null,
            observaciones: null,
            opciones: this.obtenerOpcionesPorDefecto(nuevoTipo),
            subpreguntas: nuevoTipo === 'likert' ? this.obtenerSubpreguntasPorDefecto() : []
          }];
        } else {
          // ✍️ Solo cambio de tipo, mantenemos el ID existente
          this.respuestas[preguntaId] = [{
            ...respuestaAnterior,
            tipo: nuevoTipo,
            opciones: this.obtenerOpcionesPorDefecto(nuevoTipo),
            subpreguntas: nuevoTipo === 'likert' ? this.obtenerSubpreguntasPorDefecto() : []
          }];
        }
      }
    } else {
      // ➕ No había respuesta previa → nueva respuesta
      this.respuestas[preguntaId] = [{
        id: null, // nuevo registro
        pregunta_id: preguntaId,
        tipo: nuevoTipo,
        valor: null,
        observaciones: null,
        opciones: this.obtenerOpcionesPorDefecto(nuevoTipo),
        subpreguntas: nuevoTipo === 'likert' ? this.obtenerSubpreguntasPorDefecto() : []
      }];
    }
  
    // ✅ Actualizamos los tipos de respuesta en la pregunta
    if (pregunta) {
      pregunta.tipos_de_respuesta = [{ tipo: nuevoTipo }];
    }
  
    // 🔄 Forzar detección de cambios
    this.respuestas = { ...this.respuestas };
    this.cdr.detectChanges();
  }
  
  
  obtenerOpcionesPorDefecto(tipo: string) {
    if (tipo === 'si_no') {
      return [
        { label: 'Sí', value: 'si' },
        { label: 'No', value: 'no' }
      ];
    }
  
    if (tipo === 'si_no_noestoyseguro') {
      return [
        { label: 'Sí', value: 'si' },
        { label: 'No', value: 'no' },
        { label: 'No estoy seguro', value: 'no_estoy_seguro' }
      ];
    }
  
    return [];
  }
  
  obtenerSubpreguntasPorDefecto() {
    return [{
      texto: '',
      opciones: [
        { label: 'No estoy de acuerdo', value: 'No estoy de acuerdo' },
        { label: 'Estoy un poco de acuerdo', value: 'Estoy un poco de acuerdo' },
        { label: 'Estoy de acuerdo', value: 'Estoy de acuerdo' },
        { label: 'Estoy muy de acuerdo', value: 'Estoy muy de acuerdo' }
      ]
    }];
  }
    
  /** 📌 Eliminar todas las respuestas de una pregunta */
  eliminarRespuestas(preguntaId: number) {
    if (!confirm("¿Seguro que quieres eliminar todas las respuestas de esta pregunta?")) {
      return;
    }

    this.respuestaService.eliminarRespuestasPorPregunta(preguntaId).subscribe({
      next: () => {
        alert("✅ Respuestas eliminadas con éxito.");
        this.respuestas[preguntaId] = [];
      },
      error: (err) => console.error("❌ Error al eliminar respuestas:", err)
    });
  }

  /** 📌 Métodos para agregar respuestas */
  agregarRespuestaTexto(preguntaId: number) {
    this.agregarTipoRespuesta(preguntaId, 'texto');
  }

  agregarBarraSatisfaccion(preguntaId: number) {
    this.agregarTipoRespuesta(preguntaId, 'barra_satisfaccion');
  }
  
  agregarOpcionSiNo(preguntaId: number) {
    this.agregarTipoRespuesta(preguntaId, 'si_no');
  }
  
  agregarOpcionSiNoNoEstoySeguro(preguntaId: number) {
    this.agregarTipoRespuesta(preguntaId, 'si_no_noestoyseguro');
  }

  /** 📌 Agregar Opción de 5 Emojis */
  agregarOpcion5emojis(preguntaId: number) {
    this.agregarTipoRespuesta(preguntaId, '5emojis');
  }

  obtenerOpciones5Emojis() {
    return [
      { label: 'Emoji 1', value: 'Emoji 1' },
      { label: 'Emoji 2', value: 'Emoji 2' },
      { label: 'Emoji 3', value: 'Emoji 3' },
      { label: 'Emoji 4', value: 'Emoji 4' },
      { label: 'Emoji 5', value: 'Emoji 5' }
    ];
  }

  /** 📌 Agregar Input Numérico */
  agregarInputNumerico(preguntaId: number) {
    this.agregarTipoRespuesta(preguntaId, 'numero');
  }
  

  agregarEscalaLikertEditable(preguntaId: number) {
    const pregunta = this.preguntas.find(p => p.id === preguntaId);
    if (pregunta) {
      pregunta.tipos_de_respuesta = [{ tipo: 'likert' }];
    }
  
    this.respuestas[preguntaId] = [{
      tipo: 'likert',
      valor: '',
      observaciones: '',
      opciones: [],
      subpreguntas: [{ texto: '', opciones: this.obtenerOpcionesLikert() }]
    }];
  }
  

  obtenerOpcionesLikert() {
    return [
      { label: 'No estoy de acuerdo', value: 'No estoy de acuerdo', control: new FormControl('') },
      { label: 'Estoy un poco de acuerdo', value: 'Estoy un poco de acuerdo', control: new FormControl('') },
      { label: 'Estoy de acuerdo', value: 'Estoy de acuerdo', control: new FormControl('') },
      { label: 'Estoy muy de acuerdo', value: 'Estoy muy de acuerdo', control: new FormControl('') },
      { label: 'Estoy totalmente de acuerdo', value: 'Estoy totalmente de acuerdo', control: new FormControl('') },
      { label: 'Sí', value: 'Sí', control: new FormControl('') },
      { label: 'No', value: 'No', control: new FormControl('') },
      { label: 'No es cierto', value: 'No es cierto', control: new FormControl('') },
      { label: 'En cierta manera o algunas veces', value: 'En cierta manera o algunas veces', control: new FormControl('') },
      { label: 'Muy cierto o a menudo es cierto', value: 'Muy cierto o a menudo es cierto', control: new FormControl('') },
      { label: 'No estoy seguro/a', value: 'No estoy seguro/a', control: new FormControl('') },
      { label: 'Nunca', value: 'Nunca', control: new FormControl('') },
      { label: 'A menudo', value: 'A menudo', control: new FormControl('') },
      { label: 'A veces', value: 'A veces', control: new FormControl('') },
      { label: 'Siempre', value: 'Siempre', control: new FormControl('') },
      { label: 'Una vez', value: 'Una vez', control: new FormControl('') },
      { label: 'Dos o tres veces', value: 'Dos o tres veces', control: new FormControl('') },
      { label: 'Más de tres veces', value: 'Más de tres veces', control: new FormControl('') },
      { label: 'No sé / No aplica', value: 'No sé / No aplica', control: new FormControl('') },
      { label: 'No sé', value: 'No sé', control: new FormControl('') }
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

  /** 📌 Eliminar una opción de la Escala Likert */
  eliminarOpcionLikert(subpregunta: any, opcion: any) {
    if (!subpregunta || !Array.isArray(subpregunta.opciones)) {
      console.error('❌ No se puede eliminar la opción, la subpregunta no es válida.');
      return;
    }

    subpregunta.opciones = subpregunta.opciones.filter((opt: any) => opt !== opcion);
  }

  /** 📌 Mostrar formulario de Opciones Personalizadas */
  mostrarFormularioOpcionesPersonalizadas(preguntaId: number) {
    this.preguntaSeleccionada = preguntaId;

    const pregunta = this.preguntas.find(p => p.id === preguntaId);
    if (pregunta) {
      pregunta.tipos_de_respuesta = [{ tipo: 'opcion_personalizada' }];
    }

    // 🔴 Limpiar respuestas previas mal formadas o de otro tipo
    this.respuestas[preguntaId] = [];

    // ✅ Crear una sola respuesta válida
    this.respuestas[preguntaId].push({
      id: null,
      pregunta_id: preguntaId,
      tipo: "opcion_personalizada",
      valor: "",
      observaciones: "",
      opciones: [
        { id: `temp-${Date.now()}`, label: '', value: '' }
      ],
      subpreguntas: []
    });

    // 🔁 Forzar detección de cambios en pantalla
    this.respuestas = { ...this.respuestas };
    this.cdr.detectChanges();
  }
  
  
  /** 📌 Agregar nueva opción personalizada */
  agregarOpcionPersonalizada(preguntaId: number) {
    const respuesta = this.respuestas[preguntaId]?.find(res => res.tipo === 'opcion_personalizada');
    if (!respuesta) return;

    respuesta.opciones.push({
      id: `temp-${Date.now()}`,
      label: '',
      value: ''
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

  /** 📌 Eliminar opción personalizada */
  eliminarOpcionPersonalizada(preguntaId: number, index: number) {
    const respuesta = this.respuestas[preguntaId]?.find(res => res.tipo === 'opcion_personalizada');

    if (respuesta && index >= 0 && index < respuesta.opciones.length) {
      respuesta.opciones.splice(index, 1);
    } else {
      console.warn(`⚠️ No se pudo eliminar la opción en la pregunta ${preguntaId}, índice inválido.`);
    }
  }

  eliminarRespuesta(preguntaId: number) {
    if (!confirm('¿Eliminar esta opción?')) return;

    this.respuestaService.existeDetalle(this.evaluacionId)
      .subscribe({
        next: tieneDetalle => {
          if (!tieneDetalle) {
            // 🔸 Caso: NO HAY PONDERACIONES
            this.respuestaService.eliminarRespuestasPorPregunta(preguntaId)
              .subscribe({
                next: () => {
                  this.cargarEvaluacion(this.evaluacionId); // recarga vista
                  alert('✅ Respuesta eliminada correctamente.');
                },
                error: () => {
                  alert('❌ No se pudo eliminar la respuesta.');
                }
              });

          } else {
            // 🔸 Caso: SÍ HAY PONDERACIONES
            if (!confirm('Esta evaluación ya tiene ponderaciones. ¿Desea limpiar TODO lo asociado a esta pregunta y actualizar el tipo?')) return;

            // ✅ Obtenemos el tipo actual para actualizar detalle_ponderaciones
            const tipoActual = this.preguntas.find(p => p.id === preguntaId)?.tipos_de_respuesta?.[0]?.tipo ?? null;

            if (!tipoActual) {
              alert('⚠️ No se pudo detectar el tipo actual de la pregunta. Cancelando operación.');
              return;
            }

            this.respuestaService
              .limpiarPreguntaConTipo(preguntaId, this.evaluacionId, tipoActual)
              .subscribe({
                next: () => {
                  this.cargarEvaluacion(this.evaluacionId); // recarga vista
                  alert('✅ Pregunta y sus ponderaciones limpiadas y tipo actualizado correctamente.');
                },
                error: () => {
                  alert('❌ No se pudo eliminar todo lo relacionado.');
                }
              });
          }
        },
        error: () => {
          alert('❌ No se pudo verificar si existen ponderaciones.');
        }
      });
  }

  
  agregarTipoRespuesta(preguntaId: number, nuevoTipo: string) {
    console.log(`➕ Agregando tipo de respuesta: ${nuevoTipo} a la pregunta ${preguntaId}`);
  
    const pregunta = this.preguntas.find(p => p.id === preguntaId);
    if (!pregunta) {
      console.warn(`⚠️ No se encontró la pregunta con ID ${preguntaId}`);
      return;
    }
  
    if (!pregunta.tipos_de_respuesta) {
      pregunta.tipos_de_respuesta = [];
    }
  
    pregunta.tipos_de_respuesta = [{ tipo: nuevoTipo }];
  
    if (!this.respuestas[preguntaId]) {
      this.respuestas[preguntaId] = [];
    }
  
    this.respuestas[preguntaId] = this.respuestas[preguntaId].filter(r => r.tipo === nuevoTipo);
  
    let opciones: { label: string; value: string; }[] | { id: string; label: string; }[] = [];
  
    if (nuevoTipo === '5emojis') {
      opciones = this.obtenerOpciones5Emojis();
    } else if (nuevoTipo === 'si_no_noestoyseguro') {
      opciones = [
        { label: 'Sí', value: 'si' },
        { label: 'No', value: 'no' },
        { label: 'No estoy seguro', value: 'no_estoy_seguro' }
      ];
    } else if (nuevoTipo === 'opcion_personalizada') {
      opciones = [{ id: `temp-${Date.now()}`, label: '' }];
    }
  
    this.respuestas[preguntaId].push({
      id: new Date().getTime(),
      tipo: nuevoTipo,
      valor: '',
      observaciones: '',
      opciones,
      subpreguntas: []
    });
  
    console.log(`✅ Tipo de respuesta asignado correctamente: ${nuevoTipo}`);
    this.respuestas = { ...this.respuestas };
    this.cdr.detectChanges();
  }
  
     
}
