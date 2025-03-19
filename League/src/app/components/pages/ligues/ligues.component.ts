import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ligues',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ligues.component.html',
  styleUrl: './ligues.component.css'
})
export class LiguesComponent {
  isConnected: boolean = false;

  isConnected$ = this.authService.isConnected$;

  constructor(private authService : AuthService){}

  ngOnInit(): void {
    this.isConnected = this.authService.isAuthenticated(); // Vérifie l'authentification

    if (this.isConnected) {
      console.log('Utilisateur connecté');
      // this.authService.logout();
    } else {
      console.log('Utilisateur non connecté');
    }
  }

}
