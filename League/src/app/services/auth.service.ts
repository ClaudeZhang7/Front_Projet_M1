import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.prod';
import { LoginResponse } from '../interfaces/LoginResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string;

  // Suivi de l'état de connexion
  private isConnectedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isConnected$ = this.isConnectedSubject.asObservable(); 

  constructor(private http: HttpClient, private router: Router) {
    this.apiUrl = environment.apiUrl;
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return new Observable(observer => {
      this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password }).subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          this.isConnectedSubject.next(true); // Met à jour l'état
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          this.isConnectedSubject.next(false);
          observer.error(error);
        }
      });
    });
  }
  logout(): void {
    localStorage.removeItem('token');
    this.isConnectedSubject.next(false); 
    // this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.isConnectedSubject.value; 
  }

  private hasToken(): boolean {
    if (typeof window === 'undefined') {
      return false; 
    }
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getBearer(): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.getToken()}`,
        'Content-Type': 'application/json'
      })
    };
  }

}
