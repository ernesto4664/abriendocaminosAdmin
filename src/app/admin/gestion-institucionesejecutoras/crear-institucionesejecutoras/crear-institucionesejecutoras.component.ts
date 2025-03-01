import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { InstitucionesEjecutorasService } from '../../../services/institucionesejecutoras.service';
import { TerritoriosService } from '../../../services/territorios.service';
import { PlanesIntervencionService } from '../../../services/plan-intervencion.service';

@Component({
  selector: 'app-crear-institucionesejecutoras',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './crear-institucionesejecutoras.component.html',
  styleUrl: './crear-institucionesejecutoras.component.scss'
})
export class CrearInstitucionesejecutorasComponent implements OnInit {
  institucionForm!: FormGroup;
  territorios: any[] = [];
  planesIntervencion: any[] = [];

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private institucionesService = inject(InstitucionesEjecutorasService);
  private territoriosService = inject(TerritoriosService);
  private planesService = inject(PlanesIntervencionService);

  ngOnInit() {
    this.inicializarFormulario();
    this.cargarTerritorios();
  }

  /** 📌 Inicializa el formulario */
  inicializarFormulario() {
    this.institucionForm = this.fb.group({
      nombre_fantasia: ['', Validators.required],
      nombre_legal: ['', Validators.required],
      rut: ['', [Validators.required, Validators.minLength(8)]],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      territorio_id: ['', Validators.required],
      plazas: [{ value: '', disabled: true }, [Validators.required, Validators.min(1)]], // Campo autocompletado
      planesdeintervencion_id: [''], // 🔥 Guardará el ID del plan de intervención
      planesdeintervencion_nombre: [{ value: '', disabled: true }], // 🔥 Guardará el nombre y será readonly
      periodo_registro_desde: ['', Validators.required],
      periodo_registro_hasta: ['', Validators.required],
      periodo_seguimiento_desde: ['', Validators.required],
      periodo_seguimiento_hasta: ['', Validators.required]
    });
    
  }

  /** 📌 Carga la lista de territorios */
  cargarTerritorios() {
    this.territoriosService.getTerritorios().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.territorios = data;
          console.log('📌 Territorios cargados correctamente:', this.territorios);
        } else {
          console.warn('⚠ No se encontraron territorios disponibles.');
        }
      },
      error: (err) => console.error('❌ Error al cargar territorios:', err)
    });
  }

  /** 📌 Al seleccionar un territorio, se autocompletan las plazas y se cargan los planes de intervención */
  onTerritorioChange(event: any) {
    const territorioSeleccionado = this.territorios.find(t => t.id === event.value);
  
    if (!territorioSeleccionado) {
      console.warn("⚠ Territorio no encontrado.");
      return;
    }
  
    // Autocompletar plazas
    this.institucionForm.patchValue({ plazas: territorioSeleccionado.plazas });
  
    // Obtener línea de intervención del territorio
    const lineaTerritorio = Number(territorioSeleccionado.linea_id); // Asegurar que sea número
  
    if (!lineaTerritorio) {
      console.warn("⚠ El territorio no tiene una línea de intervención.");
      this.institucionForm.patchValue({ planesdeintervencion_id: '' });
      return;
    }
  
    console.log(`🔍 Línea de intervención del territorio seleccionada: ${lineaTerritorio}`);
  
    // Buscar planes de intervención que coincidan con la línea seleccionada
    this.planesService.getPlanesPorLinea(lineaTerritorio).subscribe({
      next: (response) => {
        if (response.success) {
          const planes = response.planes;
          console.log(`📌 Planes de intervención encontrados para Línea ${lineaTerritorio}:`, planes);
  
          if (planes.length > 0) {
            // Seleccionar automáticamente el primer plan disponible
            const planSeleccionado = planes[0];
  
            this.institucionForm.patchValue({ planesdeintervencion_id: planSeleccionado.nombre });
            console.log("✅ Plan de intervención asignado correctamente:", planSeleccionado);
          } else {
            console.warn("⚠ No se encontraron planes de intervención.");
            this.institucionForm.patchValue({ planesdeintervencion_id: '' });
          }
        } else {
          console.warn("⚠ No se encontraron planes de intervención.");
          this.institucionForm.patchValue({ planesdeintervencion_id: '' });
        }
      },
      error: (err) => {
        console.error("❌ Error al cargar planes:", err);
        this.institucionForm.patchValue({ planesdeintervencion_id: '' });
      }
    });
  }
  
  /** 📌 Enviar formulario */
  onSubmit() {
    if (this.institucionForm.valid) {
      const formData = this.institucionForm.getRawValue(); // 🔥 Obtiene los valores incluso de los campos deshabilitados
      console.log('📤 Enviando datos:', formData);

      this.institucionesService.crearInstitucion(formData).subscribe({
        next: () => {
          alert('✅ Institución creada correctamente');
          this.router.navigate(['/admin/gestion-institucionesejecutoras/listar']);
        },
        error: (error) => {
          alert('❌ Error al crear la institución');
          console.error('❌ Error:', error);
        }
      });
    } else {
      alert('⚠️ Por favor, completa todos los campos antes de guardar.');
    }
  }
}
