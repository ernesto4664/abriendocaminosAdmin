import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TerritoriosService } from '../../../services/territorios.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-territorio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-territorio.component.html',
  styleUrl: './editar-territorio.component.scss'
})
export class EditarTerritorioComponent implements OnInit {
  territorioForm!: FormGroup;
  regiones: any[] = [];
  provincias: any[] = [];
  comunas: any[] = [];
  territorio: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private territoriosService: TerritoriosService
  ) {}

  ngOnInit() {
    // ✅ Inicializar el formulario vacío para evitar errores de "formGroup expects a FormGroup instance"
    this.territorioForm = this.fb.group({
      nombre_territorio: [''],
      cod_territorio: [''],
      region_id: [[]],
      provincia_id: [[]],
      comuna_id: [[]],
      plazas: [''],
      linea: ['']
    });

    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      this.territoriosService.getTerritorioById(id).subscribe({
        next: (data) => {
          console.log("📌 Territorio cargado:", data);
          this.territorio = data;

          // ✅ Asignar los valores al formulario cuando los datos se reciben
          this.territorioForm.patchValue({
            nombre_territorio: data.nombre_territorio || '',
            cod_territorio: data.cod_territorio || '',
            region_id: data.region_id || [],
            provincia_id: data.provincia_id || [],
            comuna_id: data.comuna_id || [],
            plazas: data.plazas || '',
            linea: data.linea || ''
          });

          // Cargar regiones
          this.territoriosService.getRegiones().subscribe({
            next: (regiones) => {
              this.regiones = regiones;
            },
            error: (err) => console.error("❌ Error obteniendo regiones:", err)
          });

          // Cargar provincias
          if (data.region_id && data.region_id.length > 0) {
            this.territoriosService.getProvincias(data.region_id).subscribe({
              next: (provincias) => {
                this.provincias = provincias;
              },
              error: (err) => console.error("❌ Error obteniendo provincias:", err)
            });
          }

          // Cargar comunas
          if (data.provincia_id && data.provincia_id.length > 0) {
            this.territoriosService.getComunas(data.provincia_id).subscribe({
              next: (comunas) => {
                this.comunas = comunas;
              },
              error: (err) => console.error("❌ Error obteniendo comunas:", err)
            });
          }
        },
        error: (err) => console.error("❌ Error cargando territorio:", err)
      });
    }
  }

  onRegionChange(event: any) {
    const regionIds = Array.from(event.target.selectedOptions).map((option: any) => Number(option.value));

    this.territorioForm.get('region_id')?.setValue(regionIds);
    this.territoriosService.getProvincias(regionIds).subscribe({
      next: (provincias) => {
        this.provincias = provincias;
        this.territorioForm.get('provincia_id')?.setValue([]);
        this.comunas = []; // Resetear comunas al cambiar región
        this.territorioForm.get('comuna_id')?.setValue([]);
      },
      error: (err) => console.error("❌ Error obteniendo provincias:", err)
    });
  }

  onProvinciaChange(event: any) {
    const provinciaIds = Array.from(event.target.selectedOptions).map((option: any) => Number(option.value));

    this.territorioForm.get('provincia_id')?.setValue(provinciaIds);
    this.territoriosService.getComunas(provinciaIds).subscribe({
      next: (comunas) => {
        this.comunas = comunas;
        this.territorioForm.get('comuna_id')?.setValue([]);
      },
      error: (err) => console.error("❌ Error obteniendo comunas:", err)
    });
  }

  onSubmit() {
    if (!this.territorioForm.valid) {
      alert("⚠ Por favor, completa todos los campos antes de actualizar.");
      return;
    }

    // ✅ Confirmación antes de actualizar
    if (!window.confirm("¿Estás seguro que deseas actualizar el territorio?")) {
      return;
    }

    this.territoriosService.updateTerritorio(this.territorio.id, this.territorioForm.value).subscribe({
      next: (response) => {
        console.log("✅ Territorio actualizado correctamente:", response);
        
        // ✅ Mostrar mensaje de éxito
        alert("✅ Territorio actualizado con éxito.");

        // ✅ Redirigir al listado de territorios
        this.router.navigate(['/admin/gestion-territorios/listar']);
      },
      error: (err) => {
        console.error("❌ Error actualizando territorio:", err);
        alert("❌ Hubo un error al actualizar el territorio.");
      }
    });
  }

  volver() {
    this.router.navigate(['/admin/gestion-territorios/listar']);
  }
}
