import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { InstitucionesEjecutorasService } from '../../../services/institucionesejecutoras.service';
import { TerritoriosService } from '../../../services/territorios.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-editar-institucionesejecutoras',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule, MatFormFieldModule, MatButtonModule, MatIconModule],
  templateUrl: './editar-institucionesejecutoras.component.html',
  styleUrl: './editar-institucionesejecutoras.component.scss'
})
export class EditarInstitucionesejecutorasComponent implements OnInit {
  institucionForm!: FormGroup;
  territorios: any[] = [];
  institucionId!: number;

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private institucionesService = inject(InstitucionesEjecutorasService);
  private territoriosService = inject(TerritoriosService);

  ngOnInit() {
    this.institucionId = Number(this.route.snapshot.paramMap.get('id'));
    this.inicializarFormulario();
    this.cargarTerritorios();
    this.cargarDatosInstitucion();
  }

  inicializarFormulario() {
    this.institucionForm = this.fb.group({
      nombre_fantasia: ['', Validators.required],
      nombre_legal: ['', Validators.required],
      rut: ['', [Validators.required, Validators.minLength(8)]],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      territorio_id: ['', Validators.required],
      plazas: [{ value: '', disabled: true }, Validators.required],
      planesdeintervencion_id: [''],
      planesdeintervencion_nombre: [{ value: '', disabled: true }],
      periodo_registro_desde: ['', Validators.required],
      periodo_registro_hasta: ['', Validators.required],
      periodo_seguimiento_desde: ['', Validators.required],
      periodo_seguimiento_hasta: ['', Validators.required]
    });
  }

  cargarTerritorios() {
    this.territoriosService.getTerritorios().subscribe({
      next: (data) => this.territorios = data,
      error: (err) => console.error('Error cargando territorios:', err)
    });
  }

  cargarDatosInstitucion() {
    this.institucionesService.getInstitucionById(this.institucionId).subscribe({
      next: (data) => {
        const formatoFecha = (fecha: string) => fecha ? fecha.split('T')[0] : '';

        this.institucionForm.patchValue({
          nombre_fantasia: data.nombre_fantasia,
          nombre_legal: data.nombre_legal,
          rut: data.rut,
          telefono: data.telefono,
          email: data.email,
          territorio_id: data.territorio_id,
          plazas: data.plazas || data.territorio?.plazas,
          planesdeintervencion_id: data.plan_de_intervencion?.id || '',
          planesdeintervencion_nombre: data.plan_de_intervencion?.nombre || 'Sin plan de intervención',
          periodo_registro_desde: formatoFecha(data.periodo_registro_desde),
          periodo_registro_hasta: formatoFecha(data.periodo_registro_hasta),
          periodo_seguimiento_desde: formatoFecha(data.periodo_seguimiento_desde),
          periodo_seguimiento_hasta: formatoFecha(data.periodo_seguimiento_hasta)
        });
      },
      error: (err) => console.error('Error cargando institución:', err)
    });
  }

  onTerritorioChange(event: MatSelectChange) {
    const territorioSeleccionado = this.territorios.find(t => t.id === event.value);
    if (!territorioSeleccionado) return;

    const plazas = territorioSeleccionado.plazas ?? 0;
    this.institucionForm.patchValue({ plazas });

    const plan = territorioSeleccionado.plan_intervencion;
    this.institucionForm.patchValue({
      planesdeintervencion_id: plan?.id || '',
      planesdeintervencion_nombre: plan?.nombre || 'Sin plan de intervención'
    });
  }

  onSubmit() {
    if (this.institucionForm.valid) {
      const formData = this.institucionForm.getRawValue();
      this.institucionesService.updateInstitucion(this.institucionId, formData).subscribe({
        next: () => {
          alert('✅ Institución actualizada correctamente');
          this.router.navigate(['/admin/gestion-institucionesejecutoras/listar']);
        },
        error: (error) => {
          alert('❌ Error al actualizar la institución');
          console.error(error);
        }
      });
    } else {
      alert('⚠️ Completa todos los campos correctamente.');
    }
  }
}
