import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FilterService } from '../../../services/filter.service';
import { FormsModule } from '@angular/forms';
import { Arbitre } from '../../../interfaces/Arbitre';

@Component({
  selector: 'app-arbitres',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './arbitres.component.html',
  styleUrls: ['./arbitres.component.css']
})
export class ArbitresComponent implements OnInit {
  private nextId: number = 3; 
  private apiUrl = environment.apiUrl + '/arbitres';
  public listArbitres: Arbitre[] = [];
  searchTerm: string = '';
  errorMessage: string = '';
  selectedArbitre: Arbitre | null = null;

  newArbitre = {
    nom: '',
    prenom: '',
    nationalite: ''
  };

  constructor(public authService: AuthService, private http: HttpClient, private filterService: FilterService) {}

  ngOnInit(): void {
    this.getArbitres().subscribe(data => {
      this.listArbitres = data;
    });
  }

    // a remettre
  // getLeagues(): Observable<Arbitre[]> {
  //     return this.http.get<Arbitre[]>(this.apiUrl);
  // }

  // MOCK temporaire
  getArbitres(): Observable<Arbitre[]> {
    const mockArbitres: Arbitre[] = [
      { id: 1, nom: 'Collina', prenom: 'Pierluigi', nationalite: 'Italie' },
      { id: 2, nom: 'Del Piero', prenom: 'Giuseppe', nationalite: 'Italie' }
    ];

    return new Observable(observer => {
      observer.next(mockArbitres);
      observer.complete();
    });
  }

  createArbitre(): void {
    const createdArbitre: Arbitre = {
      id: this.nextId++,
      ...this.newArbitre
    };
  
    this.listArbitres.push(createdArbitre);
    this.newArbitre = { nom: '', prenom: '', nationalite: '' };
    this.errorMessage = '';
  }
  // createArbitre(): void {
  //   this.http.post<Arbitre>(this.apiUrl, this.newArbitre, this.authService.getBearer()).subscribe({
  //     next: (createdArbitre) => {
  //       this.listArbitres.push(createdArbitre);
  //       this.newArbitre = { nom: '', prenom: '', nationalite: '' };
  //       this.errorMessage = '';
  //     },
  //     error: () => {
  //       this.errorMessage = "Échec de la création. Vérifiez les champs ou vos permissions.";
  //       setTimeout(() => this.errorMessage = '', 4000);
  //     }
  //   });
  // }

  editArbitre(arbitre: Arbitre): void {
    this.selectedArbitre = { ...arbitre };
  }

  updateArbitre(): void {
    if (!this.selectedArbitre) return;
  
    this.listArbitres = this.listArbitres.map(arbitre =>
      arbitre.id === this.selectedArbitre!.id ? { ...this.selectedArbitre! } : arbitre
    );
  
    this.selectedArbitre = null;
    this.errorMessage = '';
  }

  deleteArbitre(id: number): void {
    this.listArbitres = this.listArbitres.filter(a => a.id !== id);
    this.errorMessage = '';
  }
  
  // updateArbitre(): void {
  //   if (!this.selectedArbitre) return;

  //   const updateData = {
  //     nom: this.selectedArbitre.nom,
  //     prenom: this.selectedArbitre.prenom,
  //     nationalite: this.selectedArbitre.nationalite
  //   };

  //   this.http.patch<Arbitre>(`${this.apiUrl}/${this.selectedArbitre.id}`, updateData, this.authService.getBearer()).subscribe({
  //     next: (updatedArbitre) => {
  //       this.listArbitres = this.listArbitres.map(a =>
  //         a.id === updatedArbitre.id ? updatedArbitre : a
  //       );
  //       this.selectedArbitre = null;
  //       this.errorMessage = '';
  //     },
  //     error: () => {
  //       this.errorMessage = "Échec de la modification.";
  //       setTimeout(() => this.errorMessage = '', 4000);
  //     }
  //   });
  // }

  // deleteArbitre(id: number): void {
  //   this.http.delete<void>(`${this.apiUrl}/${id}`, this.authService.getBearer()).subscribe({
  //     next: () => {
  //       this.listArbitres = this.listArbitres.filter(a => a.id !== id);
  //       this.errorMessage = '';
  //     },
  //     error: () => {
  //       this.errorMessage = "Échec de la suppression.";
  //       setTimeout(() => this.errorMessage = '', 4000);
  //     }
  //   });
  // }

  get filteredArbitres(): Arbitre[] {
    return this.filterService.filterData(this.listArbitres, this.searchTerm, 'nom');
  }
}
