import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import Chart from 'chart.js/auto';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule }   from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatSelectModule,
    MatIconModule ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  cards = [
    {
      title: 'Institución ejecutoras',
      variant: 'primary',      // azul
      primaryLabel: 'Todas las instituciones',
      secondaryLabel: 'Crear nueva'
    },
    {
      title: 'NNA registrados',
      variant: 'success',      // verde
      primaryLabel: 'Todas las instituciones',
      secondaryLabel: 'Crear nueva'
    },
    {
      title: 'Usuarios',
      variant: 'warning',      // amarillo
      primaryLabel: 'Todas las instituciones',
      secondaryLabel: 'Crear nueva'
    },
    {
      title: 'Planes de intervención',
      variant: 'danger',       // rojo
      primaryLabel: 'Todas las instituciones',
      secondaryLabel: 'Crear nueva'
    }
  ];
  noticias = [
    { titulo: 'Nueva actualización', descripcion: 'Se han agregado nuevas funcionalidades...' },
    { titulo: 'Mantenimiento programado', descripcion: 'El sistema estará en mantenimiento...' },
    { titulo: 'Evento especial', descripcion: 'Únete al evento este fin de semana...' }
  ];

  notificaciones = [
    { mensaje: 'Recordatorio: actualización del sistema', fecha: '22 Feb 2025' },
    { mensaje: 'Nueva promoción disponible', fecha: '25 Feb 2025' }
  ];

  ngOnInit(): void {
    this.initChart();
  }

  initChart(): void {
    new Chart("statsChart", {
      type: 'line',
      data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
        datasets: [{ label: 'Usuarios nuevos', data: [50, 100, 150, 200, 250], borderColor: '#007bff' }]
      }
    });
  }
}
