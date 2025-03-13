import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TerritoriosService } from '../../../services/territorios.service';
import { UsuariosInstitucionService } from '../../../services/usuarios-institucion.service';
import { InstitucionesEjecutorasService } from '../../../services/institucionesejecutoras.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-crear-usuariosinstituciones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule, MatFormFieldModule, MatButtonModule, MatIconModule],
  templateUrl: './crear-usuariosinstituciones.component.html',
  styleUrl: './crear-usuariosinstituciones.component.scss'
})
export class CrearUsuariosinstitucionesComponent implements OnInit {
  usuarioForm!: FormGroup;
  regiones: any[] = [];
  provincias: any[] = [];
  comunas: any[] = [];
  instituciones: any[] = [];
  institucionesFiltradas: any[] = [];
  roles = ['SEREMI', 'COORDINADOR', 'PROFESIONAL'];

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private territoriosService = inject(TerritoriosService);
  private usuariosInstitucionService = inject(UsuariosInstitucionService);
  private institucionesEjecutorasService = inject(InstitucionesEjecutorasService);

  ngOnInit() {
    this.inicializarFormulario();
    this.cargarRegiones();
  }

  /** 📌 Inicializa el formulario */
  inicializarFormulario() {
    this.usuarioForm = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      rut: ['', [Validators.required, Validators.minLength(8)]],
      sexo: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      profesion: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      rol: ['PROFESIONAL', Validators.required],
      region_id: ['', Validators.required],
      provincia_id: ['', Validators.required],
      comuna_id: ['', Validators.required],
      institucion_id: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  /** 📌 Carga todas las regiones */
  cargarRegiones() {
    this.territoriosService.getRegiones().subscribe({
      next: (data) => {
        this.regiones = data;
      },
      error: (err) => console.error("❌ Error al cargar regiones", err)
    });
  }

  /** 📌 Al cambiar de región, se cargan provincias y se buscan instituciones */
  onRegionChange(event: any) {
    const regionId = event.value;
    this.provincias = [];
    this.comunas = [];
    this.usuarioForm.patchValue({ provincia_id: '', comuna_id: '', institucion_id: '' });
  
    if (regionId) {
      this.territoriosService.getProvincias([regionId]).subscribe({
        next: (data) => {
          this.provincias = data;
          this.cargarInstitucionesPorRegion(regionId); // 🔹 Llamamos a las instituciones filtradas
        },
        error: (err) => console.error("❌ Error al cargar provincias", err)
      });
    }
  }
  

  /** 📌 Al cambiar de provincia, se cargan comunas */
  onProvinciaChange(event: any) {
    const provinciaId = event.value;
    this.comunas = [];
    this.usuarioForm.patchValue({ comuna_id: '', institucion_id: '' });

    if (provinciaId) {
      this.territoriosService.getComunas([provinciaId]).subscribe({
        next: (data) => {
          this.comunas = data;
          this.filtrarInstituciones(); // 🚀 Filtra instituciones nuevamente
        },
        error: (err) => console.error("❌ Error al cargar comunas", err)
      });
    }
  }

  /** 📌 Carga instituciones según la región seleccionada */
  cargarInstitucionesPorRegion(regionId: number) {
    if (!regionId) return; // Evitar llamadas innecesarias si no hay región seleccionada
  
    this.institucionesEjecutorasService.getInstitucionesPorRegion(regionId).subscribe({
      next: (data) => {
        console.log("✅ Instituciones cargadas para la región:", regionId, data);
        this.instituciones = data;
        this.filtrarInstituciones(); // Aplica filtro inicial tras carga de instituciones
      },
      error: (err) => console.error("❌ Error al obtener instituciones:", err)
    });
  }
    

  /** 📌 Filtra las instituciones según la ubicación seleccionada */
  filtrarInstituciones() {
    const regionId = this.usuarioForm.get('region_id')?.value;
    const provinciaId = this.usuarioForm.get('provincia_id')?.value;
    const comunaId = this.usuarioForm.get('comuna_id')?.value;

    this.institucionesFiltradas = this.instituciones.filter(inst =>
      (!regionId || inst.territorio?.regiones?.some((r: any) => r.id === regionId)) &&
      (!provinciaId || inst.territorio?.provincias?.some((p: any) => p.id === provinciaId)) &&
      (!comunaId || inst.territorio?.comunas?.some((c: any) => c.id === comunaId))
    );

    console.log("🏛️ Instituciones disponibles para la ubicación seleccionada:", this.institucionesFiltradas);
  }

  /** 📌 Enviar formulario */
  onSubmit() {
    if (this.usuarioForm.valid) {
      const formData = this.usuarioForm.getRawValue();
      console.log('📤 Enviando datos:', formData);

      this.usuariosInstitucionService.crearUsuarioInstitucion(formData).subscribe({
        next: () => {
          alert('✅ Usuario creado correctamente');
          this.router.navigate(['/admin/gestion-usuariosinstituciones/listar']);
        },
        error: (error) => {
          alert('❌ Error al crear usuario');
          console.error('❌ Error:', error);
        }
      });
    } else {
      alert('⚠️ Por favor, completa todos los campos antes de guardar.');
    }
  }
}
