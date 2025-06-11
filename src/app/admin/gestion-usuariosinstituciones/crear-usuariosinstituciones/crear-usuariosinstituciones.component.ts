import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TerritoriosService } from '../../../services/territorios.service';
import { UsuariosInstitucionService } from '../../../services/usuarios-institucion.service';
import { InstitucionesEjecutorasService } from '../../../services/institucionesejecutoras.service';

@Component({
  selector: 'app-crear-usuariosinstituciones',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './crear-usuariosinstituciones.component.html',
  styleUrls: ['./crear-usuariosinstituciones.component.scss']
})
export class CrearUsuariosinstitucionesComponent implements OnInit {
  usuarioForm!: FormGroup;
  regiones: any[] = [];
  provincias: any[] = [];
  comunas: any[] = [];
  instituciones: any[] = [];
  institucionesFiltradas: any[] = [];
  roles = ['SEREMI', 'COORDINADOR', 'PROFESIONAL'];

  isSeremi = false;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private territoriosService = inject(TerritoriosService);
  private usuariosInstitucionService = inject(UsuariosInstitucionService);
  private institucionesEjecutorasService = inject(InstitucionesEjecutorasService);
  private snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.inicializarFormulario();
    this.cargarRegiones();

    // Reaccionar a cambios de rol (incluso el inicial por defecto)
    this.usuarioForm.get('rol')!.valueChanges.subscribe(() => this.onRolChange());

    // Llamada inicial para aplicar estado “PROFESIONAL” (que es tu default)
    this.onRolChange();
  }

  /** Inicializa el formulario */
  inicializarFormulario() {
    this.usuarioForm = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      rut: ['', Validators.required],
      sexo: ['', Validators.required],
      fecha_nacimiento: [null, Validators.required],
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

  /** Carga todas las regiones */
  cargarRegiones() {
    this.territoriosService.getRegiones().subscribe({
      next: data => this.regiones = data,
      error: err => console.error('❌ Error al cargar regiones', err)
    });
  }

  /** Al cambiar de rol */
  onRolChange() {
    const rol = this.usuarioForm.value.rol;
    this.isSeremi = rol === 'SEREMI';

    const provinciaCtrl   = this.usuarioForm.get('provincia_id')!;
    const comunaCtrl      = this.usuarioForm.get('comuna_id')!;
    const institucionCtrl = this.usuarioForm.get('institucion_id')!;

    if (this.isSeremi) {
      // 1) Deshabilita los campos en el FormGroup
      provinciaCtrl.disable();
      comunaCtrl.disable();
      institucionCtrl.disable();

      // 2) Limpia valores y validators
      provinciaCtrl.clearValidators();
      comunaCtrl.clearValidators();
      institucionCtrl.clearValidators();

      provinciaCtrl.setValue(null);
      comunaCtrl.setValue(null);
      institucionCtrl.setValue(null);
    } else {
      // Restaura validadores y habilita
      provinciaCtrl.enable();
      comunaCtrl.enable();
      institucionCtrl.enable();

      provinciaCtrl.setValidators([Validators.required]);
      comunaCtrl.setValidators([Validators.required]);
      institucionCtrl.setValidators([Validators.required]);
    }

    // 3) Actualiza estado
    provinciaCtrl.updateValueAndValidity();
    comunaCtrl.updateValueAndValidity();
    institucionCtrl.updateValueAndValidity();

    // Limpia arrays UI si quieres
    this.provincias = [];
    this.comunas = [];
    this.institucionesFiltradas = [];
  }

  /** Al cambiar de región */
  onRegionChange(event: any) {
    const regionId = +event.value;

    // Limpieza básica
    this.usuarioForm.patchValue({ provincia_id: [], comuna_id: [], institucion_id: [] });
    this.provincias = [];
    this.comunas = [];
    this.instituciones = [];
    this.institucionesFiltradas = [];

    if (!regionId) return;

    if (this.isSeremi) {
      // Para SEREMI: cargamos todas las provincias de la región
      this.territoriosService.getProvincias([regionId]).subscribe({
        next: provs => {
          this.provincias = provs;
          const provinceIds = provs.map(p => p.id);

          // Luego todas las comunas de esas provincias
          this.territoriosService.getComunas(provinceIds).subscribe({
            next: coms => {
              this.comunas = coms;
              const comunaIds = coms.map(c => c.id);

              // Luego todas las instituciones de la región (o de esas comunas)
              this.institucionesEjecutorasService.getInstitucionesPorRegion(regionId).subscribe({
                next: insts => {
                  this.instituciones = insts;
                  const instIds = insts.map(i => i.id);

                  // **Patch** en el formulario los arrays completos
                  // (usa getRawValue() al enviar para incluir estos campos)
                  this.usuarioForm.patchValue({
                    provincia_id: provinceIds,
                    comuna_id:   comunaIds,
                    institucion_id: instIds
                  });
                }
              });
            }
          });
        }
      });
    } else {
      // Para roles normales, comportamiento original...
      this.territoriosService.getProvincias([regionId]).subscribe(p => this.provincias = p);
      this.cargarInstitucionesPorRegion(regionId);
    }
  }

  /** Al cambiar de provincia */
  onProvinciaChange(event: any) {
    const provinciaId = +event.value;
    this.usuarioForm.patchValue({ comuna_id: '', institucion_id: '' });
    this.comunas = [];
    this.institucionesFiltradas = [];

    if (!provinciaId || this.isSeremi) return;

    this.territoriosService.getComunas([provinciaId]).subscribe({
      next: data => this.comunas = data,
      error: err => console.error('❌ Error al cargar comunas', err)
    });
    this.filtrarInstituciones();
  }

  /** Carga instituciones según la región seleccionada */
  private cargarInstitucionesPorRegion(regionId: number) {
    this.institucionesEjecutorasService.getInstitucionesPorRegion(regionId).subscribe({
      next: data => {
        this.instituciones = data;
        this.filtrarInstituciones();
      },
      error: err => console.error('❌ Error al obtener instituciones:', err)
    });
  }

  /** Filtra las instituciones según región/provincia/comuna */
  filtrarInstituciones() {
    const { region_id, provincia_id, comuna_id } = this.usuarioForm.value;
    this.institucionesFiltradas = this.instituciones.filter(inst =>
      (!region_id || inst.territorio.regiones.some((r: any) => r.id === region_id)) &&
      (!provincia_id || inst.territorio.provincias.some((p: any) => p.id === provincia_id)) &&
      (!comuna_id || inst.territorio.comunas.some((c: any) => c.id === comuna_id))
    );
  }

  /** Genera una contraseña aleatoria */
  generarContrasena() {
    const longitud = 12;
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    let contrasena = '';
    for (let i = 0; i < longitud; i++) {
      contrasena += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    this.usuarioForm.get('password')!.setValue(contrasena);
    this.snackBar.open(`🔐 Contraseña generada: ${contrasena}`, 'Cerrar', {
      duration: 6000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: 'snackbar-success'
    });
  }

  /** Envía el formulario */
  onSubmit() {
    if (this.usuarioForm.invalid) {
      this.snackBar.open('⚠️ Completa todos los campos antes de guardar.', 'Cerrar', { duration: 3000 });
      return;
    }
    const payload = this.usuarioForm.getRawValue();
    this.usuariosInstitucionService.crearUsuarioInstitucion(payload).subscribe({
      next: () => {
        this.snackBar.open('✅ Usuario creado correctamente', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/admin/gestion-usuariosinstituciones/listar']);
      },
      error: err => {
        console.error('❌ Error al crear usuario', err);
        this.snackBar.open('❌ Error al crear usuario', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
