import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UsuariosInstitucionService } from '../../../services/usuarios-institucion.service';
import { TerritoriosService } from '../../../services/territorios.service';
import { InstitucionesEjecutorasService } from '../../../services/institucionesejecutoras.service';

@Component({
  selector: 'app-editar-usuariosinstituciones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './editar-usuariosinstituciones.component.html',
  styleUrl: './editar-usuariosinstituciones.component.scss'
})
export class EditarUsuariosinstitucionesComponent implements OnInit {
  usuarioForm!: FormGroup;
  regiones: any[] = [];
  provincias: any[] = [];
  comunas: any[] = [];
  instituciones: any[] = [];
  roles = ['SEREMI', 'COORDINADOR', 'PROFESIONAL']; // Opciones de rol
  usuarioId!: number;
  cargando = false;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private usuariosInstitucionService = inject(UsuariosInstitucionService);
  private territoriosService = inject(TerritoriosService);
  private institucionesService = inject(InstitucionesEjecutorasService);

  ngOnInit() {
    this.usuarioId = Number(this.route.snapshot.paramMap.get('id'));
    this.inicializarFormulario();
    this.cargarRegiones();
    this.cargarUsuario();
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
      rol: ['', Validators.required],
      region_id: ['', Validators.required],
      provincia_id: ['', Validators.required],
      comuna_id: ['', Validators.required],
      institucion_id: ['', Validators.required],
      password: [''] // Opcional, se actualizará solo si el usuario ingresa una nueva clave
    });
  }

  /** 📌 Carga todas las regiones */
  cargarRegiones() {
    this.territoriosService.getRegiones().subscribe({
      next: (data) => this.regiones = data,
      error: (err) => console.error("❌ Error al cargar regiones", err)
    });
  }

  /** 📌 Carga los datos del usuario a editar */
  cargarUsuario() {
    this.cargando = true;
    this.usuariosInstitucionService.getUsuarioInstitucionById(this.usuarioId).subscribe({
      next: (usuario) => {
        console.log("📌 Cargando usuario:", usuario);
        this.usuarioForm.patchValue(usuario);
        this.cargarProvincias(usuario.region_id);
        this.cargarComunas(usuario.provincia_id);
        this.cargarInstituciones(usuario.region_id);
        this.cargando = false;
      },
      error: (err) => {
        console.error("❌ Error al cargar usuario", err);
        this.cargando = false;
      }
    });
  }

  /** 📌 Carga provincias según la región seleccionada */
  cargarProvincias(regionId: number) {
    this.territoriosService.getProvincias([regionId]).subscribe({
      next: (data) => this.provincias = data,
      error: (err) => console.error("❌ Error al cargar provincias", err)
    });
  }

  /** 📌 Carga comunas según la provincia seleccionada */
  cargarComunas(provinciaId: number) {
    this.territoriosService.getComunas([provinciaId]).subscribe({
      next: (data) => this.comunas = data,
      error: (err) => console.error("❌ Error al cargar comunas", err)
    });
  }

  /** 📌 Carga instituciones según la región */
  cargarInstituciones(regionId: number) {
    this.institucionesService.getInstitucionesPorRegion(regionId).subscribe({
      next: (data) => this.instituciones = data,
      error: (err) => console.error("❌ Error al cargar instituciones", err)
    });
  }

  /** 📌 Enviar actualización */
  onSubmit() {
    if (this.usuarioForm.valid) {
      const formData = this.usuarioForm.getRawValue();
      console.log('📤 Enviando datos:', formData);

      this.usuariosInstitucionService.updateUsuarioInstitucion(this.usuarioId, formData).subscribe({
        next: () => {
          alert('✅ Usuario actualizado correctamente');
          this.router.navigate(['/admin/gestion-usuariosinstituciones/listar']);
        },
        error: (error) => {
          alert('❌ Error al actualizar usuario');
          console.error('❌ Error:', error);
        }
      });
    } else {
      alert('⚠️ Por favor, completa todos los campos antes de guardar.');
    }
  }

  /** 📌 Volver al listado */
  volver() {
    this.router.navigate(['/admin/gestion-usuariosinstituciones/listar']);
  }
}
