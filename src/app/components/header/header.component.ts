import { Component } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [MatIconModule, MatButtonModule] 
})
export class HeaderComponent {

  constructor(private sidebarService: SidebarService) {}

  toggleSidebar(): void {
    console.log('Toggle Sidebar clicked');
    this.sidebarService.toggleSidebar(); // Llama al servicio para abrir/cerrar el sidebar
  }
  

  logout() {
    // Llama aquí tu método de logout si lo deseas
    // this.authService.logout();
  }
}
