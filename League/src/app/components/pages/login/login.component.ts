import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { LoginResponse } from '../../../interfaces/LoginResponse';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  token = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: (response: any) => { // Utilisation temporaire de `any`
        console.log('Réponse API:', response);
    
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Réponse invalide du serveur';
        }
      },
      error: () => {
        this.errorMessage = 'Identifiants incorrects';
      }
    });
    
  }
  

  goToLigues(): void {
    this.router.navigate(['/ligues']);
  }



}
