import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TerritoriosService } from '../../../services/territorios.service';
import { Region, Provincia, Comuna } from '../../../models/ubicacion.model'; // Importamos modelos
import { RouterModule } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-crear-territorio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatSelectModule, MatFormFieldModule, MatButtonModule, MatIconModule],
  templateUrl: './crear-territorio.component.html',
  styleUrls: ['./crear-territorio.component.scss'],
})
export class CrearTerritorioComponent {
  territorioForm: FormGroup;
  regiones: Region[] = [];
  provincias: Provincia[] = [];
  comunas: Comuna[] = [];
  lineas: any[] = [];

  constructor(private fb: FormBuilder, private territorioService: TerritoriosService, private route: ActivatedRoute,
    private router: Router,) {
      this.territorioForm = this.fb.group({
        nombre_territorio: ['', Validators.required],
        cod_territorio: [''],
        region_id: [[], Validators.required],
        provincia_id: [[], Validators.required],
        comuna_id: [[], Validators.required],
        plazas: [''],
        linea_id: ['', Validators.required], // ✅ Asegurar que sea `linea_id`
        cuota_1: [''],
        cuota_2: [''],
      });

    this.loadRegiones();
  }

  ngOnInit() {
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

  /** 📌 Cargar todas las regiones */
  loadRegiones(): void {
    this.territorioService.getRegiones().subscribe({
      next: (data) => {
        console.log("✅ Regiones cargadas:", data);
        this.regiones = data;
      },
      error: (err) => console.error("⚠️ Error al cargar regiones:", err),
    });
  }

  /** 📌 Extraer opciones seleccionadas de un select múltiple */
  extractSelectedOptions(event: Event): number[] {
    return Array.from((event.target as HTMLSelectElement).selectedOptions)
      .map(option => Number((option as HTMLOptionElement).value)); // Convertir valores a números
  }

  /** 📌 Cambio en selección de regiones */
  onRegionChange(event: any) {
    const selectedValues = event.value; 
    this.territorioForm.patchValue({ region_id: selectedValues });
  
    if (selectedValues.length > 0) {
      this.territorioService.getProvincias(selectedValues).subscribe({
        next: (data) => {
          console.log("✅ Provincias recibidas:", data);
          this.provincias = data;
          this.comunas = []; 
        },
        error: (err) => console.error("⚠️ Error al cargar provincias:", err),
      });
    } else {
      this.provincias = [];
      this.comunas = [];
    }
  }
  
  /** 📌 Cambio en selección de provincias */
  onProvinciaChange(event: any) {
    const selectedValues = event.value; 
    this.territorioForm.patchValue({ provincia_id: selectedValues });
  
    if (selectedValues.length > 0) {
      this.territorioService.getComunas(selectedValues).subscribe({
        next: (data) => {
          console.log("✅ Comunas recibidas:", data);
          this.comunas = data;
        },
        error: (err) => console.error("⚠️ Error al cargar comunas:", err),
      });
    } else {
      this.comunas = [];
    }
  }
  
  /** 📌 Cambio en selección de comunas */
  onComunaChange(event: any) {
    const selectedValues = event.value;
    this.territorioForm.patchValue({ comuna_id: selectedValues });
  }
  
  formatCurrency(field: string, blur: boolean = false) {
    let value = this.territorioForm.get(field)?.value;
    if (!value) return;
  
    let rawValue = value.toString().replace(/\D/g, '');
    let numericValue = parseInt(rawValue, 10);
  
    if (!isNaN(numericValue)) {
      let formattedValue = new Intl.NumberFormat('es-CL').format(numericValue);
      if (blur) formattedValue += ' CLP';
      this.territorioForm.get(field)?.setValue(formattedValue, { emitEvent: false });
    }
  }

  /** 📌 Enviar formulario */
  onSubmit(): void {
    if (this.territorioForm.invalid) {
      console.warn("⚠️ Formulario inválido, revisa los campos.");
      return;
    }
  
    try {
      const formData = {
        ...this.territorioForm.value,
        region_id: this.parseArrayField(this.territorioForm.value.region_id),
        provincia_id: this.parseArrayField(this.territorioForm.value.provincia_id),
        comuna_id: this.parseArrayField(this.territorioForm.value.comuna_id),
        cuota_1: this.parseCurrency(this.territorioForm.value.cuota_1),
        cuota_2: this.parseCurrency(this.territorioForm.value.cuota_2),
      };
  
      console.log("🚀 Enviando formulario:", formData);
  
      this.territorioService.createTerritorio(formData).subscribe({
        next: (response) => {
          console.log('✅ Territorio creado:', response);
          alert('✅ Territorio creado con éxito');
          this.router.navigate(['/admin/gestion-territorios/listar']); // Redirección tras éxito
        },
        error: (err) => {
          console.error('⚠️ Error al crear el territorio:', err);
          alert(`❌ Error al crear el territorio: ${err.message}`);
        }
      });
  
    } catch (error) {
      console.error("⛔ Error procesando el formulario:", error);
      alert("⛔ Ha ocurrido un error inesperado. Revisa los datos e intenta de nuevo.");
    }
  }
  
  /**
   * 📌 Convierte valores en string a arrays si es necesario
   */
  parseArrayField(value: any): number[] {
    if (Array.isArray(value)) return value;
    try {
      return JSON.parse(value);
    } catch {
      console.warn("⚠️ Error convirtiendo a array:", value);
      return [];
    }
  }
  
  /**
   * 📌 Convierte valores formateados en pesos chilenos a números enteros
   */
  parseCurrency(value: any): number {
    if (!value) return 0;
    return parseInt(value.toString().replace(/\D/g, ''), 10) || 0;
  }
  
  
}
