import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NnaConCuidadorDetalle, EjecucionInstrumentosService, Evaluacion } from '../../../services/ejecucion-instrumentos.service';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detalle-ejecucion-instrumento',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './detalle-ejecucion-instrumento.component.html',
  styleUrl: './detalle-ejecucion-instrumento.component.scss'
})
export class DetalleEjecucionInstrumentoComponent implements OnInit {

  nna?: NnaConCuidadorDetalle; // Usa la interfaz de detalle
  evaluaciones: Evaluacion[] = [];
  evaluacionSeleccionada: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private ejecucionService: EjecucionInstrumentosService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.ejecucionService.getNnaDetalle(id).subscribe(data => {
      this.nna = data; // Ya no es necesario hacer spread ni agregar campos manualmente
    });
    this.ejecucionService.getEvaluaciones().subscribe(data => {
      this.evaluaciones = data;
    });
  }

  volver() {
    this.router.navigate(['/admin/ejecucion-instrumentos']);
  }

  realizarEvaluacion(id: number | null) {
  if (id && this.nna?.id) {
    this.router.navigate(['/admin/ejecucion-instrumentos/realizar-evaluacion', id, this.nna.id]);
  }
}

}
