import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthUserService } from '../services/auth-user.service'; // Ajusta la ruta según tu estructura
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-login_userinstitucion',
  standalone: true,
  imports: [CommonModule, FormsModule,MatButtonModule,MatIconModule],
  templateUrl: './login_userinstitucion.component.html',
  styleUrl: './login_userinstitucion.component.scss'
})
export class Login_UserinstitucionComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthUserService,
    private router: Router
  ) {}

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/']); // Redirige a donde desees tras login
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Error al iniciar sesión';
      }
    });
  }
}
