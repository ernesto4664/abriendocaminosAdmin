// ponderaciones.model.ts

/** Detalle de ponderación por pregunta o subpregunta */
export interface DetallePonderacion {
    id: number;
    pregunta_id: number;
    pregunta_texto: string;
    subpregunta_id?: number | null;
    subpregunta_texto?: string | null;
    tipo: string;
    valor: number;
    respuesta_correcta_id?: number | null;
    respuesta_correcta_label?: string | null;
  }
  
  /** Una pregunta completa, con todas sus subpreguntas (para likert) */
  export interface PreguntaCompleta {
    pregunta_id: number;
    pregunta_texto: string;
    tipo: string;
    /** Si es likert, aquí vendrán cada subpregunta como un DetallePonderacion */
    subpreguntas?: DetallePonderacion[];
    /** Para otros tipos, podemos tomar el primer DetallePonderacion */
    detalleSimple?: DetallePonderacion;
  }
  
  /** La evaluación completa con su nombre, totales y lista de preguntas */
  export interface EvaluacionPonderada {
    id: number;
    plan_id: number;
    evaluacion_id: number;
    evaluacion_nombre: string;
    total_puntos: number;
    detalles: DetallePonderacion[];
  
    /**
     * A partir de `detalles` y su campo `pregunta_id` agrupamos:
     * - preguntas de tipo distinto a likert van en `detalleSimple`
     * - likert en `subpreguntas`
     */
    preguntas: PreguntaCompleta[];
  }
  
  export interface PreguntaAgrupada {
    pregunta_id: number;
    pregunta_texto: string;
    tipo: string;
    items: DetallePonderacion[];
  }