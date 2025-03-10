import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule para el async pipe
import { SidebarService } from '../../services/sidebar.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, MatIconModule, MatButtonModule]
})
export class HeaderComponent {
  constructor(public sidebarService: SidebarService) {}

  toggleSidebar(): void {
    console.log('Toggle Sidebar clicked');
    this.sidebarService.toggleSidebar();
  }

  logout(): void {
    // Implementa la lógica de logout si es necesario
  }
}
