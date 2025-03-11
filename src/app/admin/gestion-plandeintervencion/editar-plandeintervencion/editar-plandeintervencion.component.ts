import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanesIntervencionService } from '../../../services/plan-intervencion.service';
import { TerritoriosService } from '../../../services/territorios.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BehaviorSubject } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-editar-plandeintervencion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,MatSelectModule, MatFormFieldModule,MatButtonModule,MatIconModule],
  templateUrl: './editar-plandeintervencion.component.html',
  styleUrl: './editar-plandeintervencion.component.scss'
})
export class EditarPlandeintervencionComponent implements OnInit {
  planForm!: FormGroup;
  puedeGuardar$ = new BehaviorSubject<boolean>(false);
  private fb = inject(FormBuilder);
  private planService = inject(PlanesIntervencionService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  planId!: number;
  evaluacion: any;
  lineas: any[] = [];

  constructor( private territorioService: TerritoriosService) {
       
  }

  ngOnInit() {
    this.planId = Number(this.route.snapshot.paramMap.get('id'));
    this.inicializarFormulario();
    this.cargarDatosPlan();
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

  /** 📌 Inicializa el formulario vacío */
  inicializarFormulario() {
    this.planForm = this.fb.group({
      id: [''],
      nombre: ['', Validators.required],
      linea_id: ['', Validators.required],
      descripcion: [''],
      evaluaciones: this.fb.array([])
    });

    this.verificarPuedeGuardar();
  }

  /** 📌 Obtiene evaluaciones como FormArray */
  get evaluacionesFormArray() {
    return this.planForm.get('evaluaciones') as FormArray;
  }

  /** 📌 Cargar datos del plan de intervención */
  cargarDatosPlan() {
    this.planService.getPlanById(this.planId).subscribe({
      next: (plan) => {
        console.log("📌 Plan recibido de la API:", plan);

        this.planForm.patchValue({
          id: plan.id,
          nombre: plan.nombre,
          linea_id: plan.linea_nombre,
          descripcion: plan.descripcion
        });

        // 📌 Cargar evaluaciones y preguntas asociadas
        const evaluacionesFormArray = this.evaluacionesFormArray;
        evaluacionesFormArray.clear();

        plan.evaluaciones.forEach((evaluacion: any) => {
          const evaluacionGroup = this.fb.group({
            id: [evaluacion.id],
            nombre: [evaluacion.nombre, Validators.required],
            eliminar: [false],  // 🔥 Aseguramos que TODAS las evaluaciones tengan este campo
            preguntas: this.fb.array([])
          });

          if (evaluacion.preguntas && Array.isArray(evaluacion.preguntas)) {
            evaluacion.preguntas.forEach((pregunta: any) => {
              (evaluacionGroup.get('preguntas') as FormArray).push(
                this.fb.group({
                  id: [pregunta.id],
                  pregunta: [pregunta.pregunta, Validators.required],
                  eliminar: [false] // 🔥 También aseguramos que las preguntas lo tengan
                })
              );
            });
          }

          evaluacionesFormArray.push(evaluacionGroup);
        });

        this.verificarPuedeGuardar();
      },
      error: (err) => console.error('❌ Error al cargar el plan:', err)
    });
}



  /** 📌 Agregar evaluación */
  agregarEvaluacion() {
    const nuevaEvaluacion = this.fb.group({
      id: [''],
      nombre: ['', Validators.required],
      preguntas: this.fb.array([])
    });

    this.evaluacionesFormArray.push(nuevaEvaluacion);
    this.verificarPuedeGuardar();
  }

  /** 📌 Obtener preguntas de una evaluación */
  getPreguntas(evaluacionIndex: number) {
    return this.evaluacionesFormArray.at(evaluacionIndex).get('preguntas') as FormArray;
  }

  /** 📌 Agregar pregunta a una evaluación */
  agregarPregunta(evaluacionIndex: number) {
    const preguntas = this.getPreguntas(evaluacionIndex);
    preguntas.push(this.fb.group({
      id: [''],
      pregunta: ['', Validators.required]
    }));
    this.verificarPuedeGuardar();
  }

  /** 📌 Verificar si se puede guardar */
  verificarPuedeGuardar() {
    const validacion = this.planForm.valid;
    this.puedeGuardar$.next(validacion);
  }

    /** 📌 Confirmar eliminación de pregunta */
    confirmarEliminarPregunta(evaluacionIndex: number, preguntaIndex: number) {
      const confirmar = confirm('¿Seguro que quieres eliminar esta pregunta?');
      if (confirmar) {
          const preguntas = this.getPreguntas(evaluacionIndex);
          const pregunta = preguntas.at(preguntaIndex);
          
          if (pregunta) {
              pregunta.patchValue({ eliminar: true }); // 🔥 Oculta el input en el frontend
              console.log(`🗑️ Pregunta ID ${pregunta.value.id} marcada para eliminar.`);
          }
      }
  }
  
  /** 📌 Confirmar eliminación de evaluación */
  confirmarEliminarEvaluacion(index: number) {
    const confirmar = confirm('¿Seguro que quieres eliminar esta evaluación y todas sus preguntas?');
    if (confirmar) {
        const evaluaciones = this.evaluacionesFormArray;
        const evaluacion = evaluaciones.at(index);

        if (evaluacion) {
            evaluacion.patchValue({ eliminar: true }); // 🔥 Oculta la evaluación en el frontend
            console.log(`🗑️ Evaluación ID ${evaluacion.value.id} marcada para eliminar.`);
        }
    }
}

  eliminarEvaluacion(index: number) {
    const confirmacion = confirm('⚠️ ¿Estás seguro de que deseas eliminar esta evaluación y todas sus preguntas? Nota: para confirmar la eliminacion recuerda guardar cambios?');
    if (confirmacion) {
        const evaluaciones = this.evaluacionesFormArray;
        const evaluacion = evaluaciones.at(index);

        if (evaluacion?.value.id) {
            console.log(`🗑️ Marcando evaluación ID ${evaluacion.value.id} para eliminar.`);
            evaluacion.setValue({ ...evaluacion.value, eliminar: true });

            // 📌 Verificar si "eliminar": true está presente antes de enviar
            console.log("📌 Evaluaciones actualizadas en el formulario:", this.planForm.value.evaluaciones);
        } else {
            // ❌ Si no tiene ID, se elimina directamente del frontend
            evaluaciones.removeAt(index);
        }
    }
  }

  eliminarPregunta(evaluacionIndex: number, preguntaIndex: number) {
    const confirmacion = confirm('⚠️ ¿Estás seguro de que deseas eliminar esta pregunta? Nota: para confirmar la eliminacion recuerda guardar cambios');
    if (confirmacion) {
        const preguntas = this.getPreguntas(evaluacionIndex);
        const pregunta = preguntas.at(preguntaIndex);
        
        if (pregunta?.value.id) {
            // ✅ Usamos setValue en lugar de patchValue para garantizar la actualización
           
            pregunta.setValue({ ...pregunta.value, eliminar: true });

            // 📌 Verificar si "eliminar": true está presente
            console.log("📌 Preguntas actualizadas en el formulario:", this.planForm.value.evaluaciones[evaluacionIndex].preguntas);
        } else {
            // ❌ Si no tiene ID, entonces sí se puede eliminar visualmente
            preguntas.removeAt(preguntaIndex);
        }
    }
  }

  eliminarPlan() {
    const confirmacion = confirm('⚠️ ¿Estás seguro de que deseas eliminar este Plan de Intervención? Se eliminarán todas las evaluaciones y preguntas asociadas.');
    if (!confirmacion) return;
  
    this.planService.deletePlan(this.planId).subscribe({
      next: () => {
        alert('✅ Plan de Intervención eliminado correctamente');
        this.router.navigate(['/admin/gestion-plandeintervencion/listar']);
      },
      error: (error: any) => {
        alert('❌ Error al eliminar el plan');
        console.error('❌ Error:', error);
      }
    });
  }

  /** 📌 Guardar cambios */
  onSubmit() {
    if (this.planForm.valid) {
        const formData = this.planForm.value;
        
        // 📌 Verificar si hay elementos marcados para eliminar antes de enviarlos
        console.log("📤 Enviando datos al backend:", JSON.stringify(formData, null, 2));

        this.planService.updatePlan(this.planId, formData).subscribe({
            next: () => {
                alert('✅ Plan actualizado correctamente');
                this.router.navigate(['/admin/gestion-plandeintervencion/listar']);
            },
            error: (error: any) => {
                alert('❌ Error al actualizar el plan');
                console.error('❌ Error:', error);
            }
        });
    } else {
        alert('⚠️ Por favor, completa los campos obligatorios antes de guardar.');
    }
}


  /** 📌 TrackBy para *ngFor */
  trackById(_index: number, item: any): string {
    return item.id;
  }
  
}
