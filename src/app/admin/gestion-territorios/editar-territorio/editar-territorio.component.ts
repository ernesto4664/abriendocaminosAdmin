import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TerritoriosService } from '../../../services/territorios.service';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-editar-territorio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './editar-territorio.component.html',
  styleUrl: './editar-territorio.component.scss'
})
export class EditarTerritorioComponent implements OnInit {
  territorioForm!: FormGroup;
  regiones: any[] = [];
  provincias: any[] = [];
  lineas: any[] = []; 
  comunas: any[] = [];
  territorio: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private territoriosService: TerritoriosService
  ) {}

  ngOnInit() {
    this.territorioForm = this.fb.group({
      nombre_territorio: [''],
      cod_territorio: [''],
      region_id: [[]],
      provincia_id: [[]],
      comuna_id: [[]],
      plazas: [''],
      linea_id: ['']
    });

    this.loadLineas();

    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      this.territoriosService.getTerritorioById(id).subscribe({
        next: (data) => {
          console.log("📌 Territorio cargado:", data);
          this.territorio = data;

          this.territorioForm.patchValue({
            nombre_territorio: data.nombre_territorio || '',
            cod_territorio: data.cod_territorio || '',
            region_id: data.region_id || [],
            provincia_id: data.provincia_id || [],
            comuna_id: data.comuna_id || [],
            plazas: data.plazas || '',
            linea_id: data.linea_id || ''
          });

          this.territoriosService.getRegiones().subscribe({
            next: (regiones) => this.regiones = regiones,
            error: (err) => console.error("❌ Error obteniendo regiones:", err)
          });

          if (data.region_id.length > 0) {
            this.territoriosService.getProvincias(data.region_id).subscribe({
              next: (provincias) => this.provincias = provincias,
              error: (err) => console.error("❌ Error obteniendo provincias:", err)
            });
          }

          if (data.provincia_id.length > 0) {
            this.territoriosService.getComunas(data.provincia_id).subscribe({
              next: (comunas) => this.comunas = comunas,
              error: (err) => console.error("❌ Error obteniendo comunas:", err)
            });
          }
        },
        error: (err) => console.error("❌ Error cargando territorio:", err)
      });
    }
  }

    /** 📌 Cargar todas las líneas de intervención */
    loadLineas() {
      this.territoriosService.getLineas().subscribe({
        next: (data) => {
          this.lineas = data;
          console.log("✅ Líneas de intervención cargadas:", data);
        },
        error: (err) => console.error("⚠️ Error al cargar líneas:", err)
      });
    }

  onRegionChange(event: any) {
    this.territorioForm.get('region_id')?.setValue(event.value);
    this.territoriosService.getProvincias(event.value).subscribe({
      next: (provincias) => {
        this.provincias = provincias;
        this.territorioForm.get('provincia_id')?.setValue([]);
        this.comunas = [];
        this.territorioForm.get('comuna_id')?.setValue([]);
      },
      error: (err) => console.error("❌ Error obteniendo provincias:", err)
    });
  }

  onProvinciaChange(event: any) {
    this.territorioForm.get('provincia_id')?.setValue(event.value);
    this.territoriosService.getComunas(event.value).subscribe({
      next: (comunas) => {
        this.comunas = comunas;
        this.territorioForm.get('comuna_id')?.setValue([]);
      },
      error: (err) => console.error("❌ Error obteniendo comunas:", err)
    });
  }

  onSubmit() {
    if (!this.territorioForm.valid) {
      alert("⚠ Completa todos los campos antes de actualizar.");
      return;
    }

    if (!window.confirm("¿Estás seguro que deseas actualizar el territorio?")) {
      return;
    }

    this.territoriosService.updateTerritorio(this.territorio.id, this.territorioForm.value).subscribe({
      next: () => {
        alert("✅ Territorio actualizado con éxito.");
        this.router.navigate(['/admin/gestion-territorios/listar']);
      },
      error: (err) => {
        console.error("❌ Error actualizando territorio:", err);
        alert("❌ Hubo un error al actualizar.");
      }
    });
  }

  volver() {
    this.router.navigate(['/admin/gestion-territorios/listar']);
  }
}
