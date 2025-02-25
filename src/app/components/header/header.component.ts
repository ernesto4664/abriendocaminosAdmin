import { Component } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service'; // Importa tu servicio
//import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(private sidebarService: SidebarService,) {}

  toggleSidebar(): void {
    console.log('Toggle Sidebar clicked'); // Asegúrate de que este mensaje aparezca en la consola
    this.sidebarService.toggleSidebar(); // Llama al servicio para abrir/cerrar el sidebar
  }

  logout() {
   // this.authService.logout();
  }
}
