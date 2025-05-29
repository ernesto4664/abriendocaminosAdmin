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
  institucionesFiltradas: any[] = [];
  roles = ['SEREMI', 'COORDINADOR', 'PROFESIONAL'];
  usuarioId!: number;
  cargando = false;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private usuariosInstitucionService = inject(UsuariosInstitucionService);
  private territoriosService = inject(TerritoriosService);
  private institucionesService = inject(InstitucionesEjecutorasService); // ✅ este es el nombre correcto

  ngOnInit() {
    this.usuarioId = Number(this.route.snapshot.paramMap.get('id'));
    this.inicializarFormulario();
    this.cargarRegiones();
    this.cargarUsuario();
  }

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
      password: ['']
    });
  }

  cargarRegiones() {
    this.territoriosService.getRegiones().subscribe({
      next: (data: any) => this.regiones = data,
      error: (err: any) => console.error("❌ Error al cargar regiones", err)
    });
  }

  cargarUsuario() {
    this.cargando = true;
    this.usuariosInstitucionService.getUsuarioInstitucionById(this.usuarioId).subscribe({
      next: (usuario: any) => {
        const fechaFormateada = usuario.fecha_nacimiento?.split('T')[0] ?? '';

        this.usuarioForm.patchValue({
          nombres: usuario.nombres,
          apellidos: usuario.apellidos,
          rut: usuario.rut,
          sexo: usuario.sexo,
          fecha_nacimiento: fechaFormateada,
          profesion: usuario.profesion,
          email: usuario.email,
          rol: usuario.rol,
          region_id: usuario.region_id,
          provincia_id: usuario.provincia_id,
          comuna_id: usuario.comuna_id,
          institucion_id: usuario.institucion_id
        });

        this.territoriosService.getProvincias([usuario.region_id]).subscribe({
          next: (data: any) => {
            this.provincias = data;
            this.territoriosService.getComunas([usuario.provincia_id]).subscribe({
              next: (comunas: any) => {
                this.comunas = comunas;
                this.cargarInstitucionesPorRegion(usuario.region_id);
                this.cargando = false;
              },
              error: (err: any) => {
                console.error("❌ Error al cargar comunas", err);
                this.cargando = false;
              }
            });
          },
          error: (err: any) => {
            console.error("❌ Error al cargar provincias", err);
            this.cargando = false;
          }
        });
      },
      error: (err: any) => {
        console.error("❌ Error al cargar usuario", err);
        this.cargando = false;
      }
    });
  }

  onRegionChange(event: any) {
    const regionId = event.value;
    this.provincias = [];
    this.comunas = [];
    this.usuarioForm.patchValue({ provincia_id: '', comuna_id: '', institucion_id: '' });

    if (regionId) {
      this.territoriosService.getProvincias([regionId]).subscribe({
        next: (data: any) => {
          this.provincias = data;
          this.cargarInstitucionesPorRegion(regionId);
        },
        error: (err: any) => console.error("❌ Error al cargar provincias", err)
      });
    }
  }

  onProvinciaChange(event: any) {
    const provinciaId = event.value;
    this.comunas = [];
    this.usuarioForm.patchValue({ comuna_id: '', institucion_id: '' });

    if (provinciaId) {
      this.territoriosService.getComunas([provinciaId]).subscribe({
        next: (data: any) => {
          this.comunas = data;
          this.filtrarInstituciones();
        },
        error: (err: any) => console.error("❌ Error al cargar comunas", err)
      });
    }
  }

  cargarInstitucionesPorRegion(regionId: number) {
    if (!regionId) return;

    this.institucionesService.getInstitucionesPorRegion(regionId).subscribe({
      next: (data: any) => {
        this.instituciones = data;
        this.filtrarInstituciones();
      },
      error: (err: any) => console.error("❌ Error al obtener instituciones:", err)
    });
  }

  filtrarInstituciones() {
    const regionId = this.usuarioForm.get('region_id')?.value;
    const provinciaId = this.usuarioForm.get('provincia_id')?.value;
    const comunaId = this.usuarioForm.get('comuna_id')?.value;

    this.institucionesFiltradas = this.instituciones.filter(inst =>
      (!regionId || inst.territorio?.regiones?.some((r: any) => r.id === regionId)) &&
      (!provinciaId || inst.territorio?.provincias?.some((p: any) => p.id === provinciaId)) &&
      (!comunaId || inst.territorio?.comunas?.some((c: any) => c.id === comunaId))
    );
  }

  onSubmit() {
    if (this.usuarioForm.valid) {
      const formData = this.usuarioForm.getRawValue();
      this.usuariosInstitucionService.updateUsuarioInstitucion(this.usuarioId, formData).subscribe({
        next: () => {
          alert('✅ Usuario actualizado correctamente');
          this.router.navigate(['/admin/gestion-usuariosinstituciones/listar']);
        },
        error: (error: any) => {
          alert('❌ Error al actualizar usuario');
          console.error('❌ Error:', error);
        }
      });
    } else {
      alert('⚠️ Por favor, completa todos los campos antes de guardar.');
    }
  }

  volver() {
    this.router.navigate(['/admin/gestion-usuariosinstituciones/listar']);
  }
}
