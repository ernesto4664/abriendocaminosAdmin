import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import Chart from 'chart.js/auto';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule }   from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatSelectModule,
    MatIconModule ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(private router: Router) {}

  cards = [
    {
      title: 'Institución ejecutoras',
      variant: 'primary',
      primaryLabel: 'Todas las instituciones',
      primaryUrl: '/instituciones',
      secondaryLabel: 'Crear nueva',
      secondaryUrl: '/instituciones/crear'
    },
    {
      title: 'NNA registrados',
      variant: 'success',
      primaryLabel: 'Todos los NNA',
      primaryUrl: '/nna',
      secondaryLabel: 'Registrar nuevo',
      secondaryUrl: '/nna/crear'
    },
    {
      title: 'Usuarios',
      variant: 'warning',
      primaryLabel: 'Todos los usuarios',
      primaryUrl: '/admin/usuarios-registrados',
      secondaryLabel: 'Crear nuevo',
      secondaryUrl: '/admin/usuarios-registrados'
    },
    {
      title: 'Planes de intervención',
      variant: 'danger',
      primaryLabel: 'Todos los planes',
      primaryUrl: '/planes',
      secondaryLabel: 'Crear nuevo',
      secondaryUrl: '/planes/crear'
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
  goTo(url: string): void {
    this.router.navigateByUrl(url);
  }
}
