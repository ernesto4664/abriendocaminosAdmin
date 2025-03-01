import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { PlanesIntervencionService } from '../../../services/plan-intervencion.service';
import { TerritoriosService } from '../../../services/territorios.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-crear-plandeintervencion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './crear-plandeintervencion.component.html',
  styleUrl: './crear-plandeintervencion.component.scss'
})
export class CrearPlandeintervencionComponent implements OnInit {
  planForm!: FormGroup;
  puedeGuardar$ = new BehaviorSubject<boolean>(false);
  private fb = inject(FormBuilder);
  private planService = inject(PlanesIntervencionService);
  private router = inject(Router);
  lineas: any[] = [];

    constructor( private territorioService: TerritoriosService) {
       
    }

  ngOnInit() {
    this.inicializarFormulario();
    this.planForm.valueChanges.pipe(distinctUntilChanged()).subscribe(() => {
      this.verificarPuedeGuardar();
    });
    this.loadLineas();
  }

  loadLineas() {
    this.territorioService.getLineas().subscribe({
      next: (data) => {
        console.log("✅ Líneas cargadas:", data);
        this.lineas = data;
      },
      error: (err) => {
        console.error("⚠️ Error al cargar líneas:", err);
        alert("⚠️ Error al cargar las líneas de intervención. Revisa la consola.");
      }
    });
  }

  /** 📌 Inicializa el formulario sin modificar la estructura */
  inicializarFormulario() {
    this.planForm = this.fb.group({
      id: this.generarId(),
      nombre: ['', Validators.required],
      linea_id: ['', Validators.required],
      descripcion: [''],
      evaluaciones: this.fb.array([])  // 🛠 Se deja vacío para respetar lo que tienes
    });

    this.verificarPuedeGuardar();
  }

  /** 📌 Devuelve las evaluaciones como FormArray */
  get evaluacionesFormArray() {
    return this.planForm.get('evaluaciones') as FormArray;
  }

  /** 📌 Genera un ID único */
  generarId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  /** 📌 Agrega una evaluación */
  agregarEvaluacion() {
    const nuevaEvaluacion = this.fb.group({
      id: this.generarId(),
      nombre: ['', Validators.required],
      preguntas: this.fb.array([])
    });

    this.evaluacionesFormArray.push(nuevaEvaluacion);
    this.verificarPuedeGuardar();
  }

  /** 📌 Devuelve las preguntas de una evaluación */
  getPreguntas(evaluacionIndex: number) {
    return this.evaluacionesFormArray.at(evaluacionIndex).get('preguntas') as FormArray;
  }

  /** 📌 Agrega una nueva pregunta */
  agregarPregunta(evaluacionIndex: number) {
    const preguntas = this.getPreguntas(evaluacionIndex);
    const nuevaPregunta = this.fb.group({
      id: this.generarId(),
      pregunta: ['', Validators.required]
    });

    preguntas.push(nuevaPregunta);
    this.verificarPuedeGuardar();
  }

  /** 📌 Eliminar una evaluación */
  eliminarEvaluacion(index: number) {
    this.evaluacionesFormArray.removeAt(index);
    this.verificarPuedeGuardar();
  }

  /** 📌 Eliminar una pregunta específica */
  eliminarPregunta(evaluacionIndex: number, preguntaIndex: number) {
    this.getPreguntas(evaluacionIndex).removeAt(preguntaIndex);
    this.verificarPuedeGuardar();
  }

  /** 📌 Confirmar eliminación de una pregunta */
  confirmarEliminarPregunta(evaluacionIndex: number, preguntaIndex: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta pregunta?')) {
      this.eliminarPregunta(evaluacionIndex, preguntaIndex);
    }
  }

  /** 📌 Confirmar eliminación de una evaluación */
  confirmarEliminarEvaluacion(index: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta evaluación?')) {
      this.eliminarEvaluacion(index);
    }
  }

  /** 📌 Verifica si se puede guardar */
  verificarPuedeGuardar() {
    const validacion =
      this.planForm.valid &&
      this.evaluacionesFormArray.length > 0 &&
      this.evaluacionesFormArray.controls.every(evaluacion => {
        const preguntas = evaluacion.get('preguntas') as FormArray;
        return evaluacion.get('nombre')?.valid && preguntas.length > 0 && preguntas.controls.every(p => p.get('pregunta')?.valid);
      });

    this.puedeGuardar$.next(validacion);
  }

  /** 📌 Enviar formulario */
  onSubmit() {
    if (this.puedeGuardar$.value) {
      this.planService.createPlan(this.planForm.value).subscribe({
        next: () => {
          alert('Plan de intervención creado con éxito');
          this.router.navigate(['/admin/gestion-plandeintervencion/listar']);
        },
        error: (err) => {
          console.error('Error al crear el plan:', err);
        }
      });
    } else {
      alert('Por favor, complete todos los campos obligatorios.');
    }
  }

  /** 📌 `trackBy` en *ngFor para optimización */
  trackById(index: number, item: any): string {
    return item.id;
  }
}
