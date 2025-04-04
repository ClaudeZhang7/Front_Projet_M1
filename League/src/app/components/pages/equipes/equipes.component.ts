import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FilterService } from '../../../services/filter.service';
import { FormsModule } from '@angular/forms';
import { Equipe } from '../../../interfaces/Equipe';

@Component({
  selector: 'app-equipes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './equipes.component.html',
  styleUrls: ['./equipes.component.css']
})
export class EquipesComponent implements OnInit {

  private apiUrl = environment.apiUrl + '/equipes';
  public listEquipes: Equipe[] = [];
  searchTerm: string = '';
  errorMessage: string = '';
  selectedEquipe: Equipe | null = null;

  newEquipe = {
    nom: '',
    ville: '',
    stade: ''
  };

  constructor(public authService: AuthService,private http: HttpClient,private filterService: FilterService) {}

  ngOnInit(): void {
    this.getEquipes().subscribe(data => {
      this.listEquipes = data;
    });
  }

  // A remettre quand on aura l'api !
  // getEquipes(): Observable<Equipe[]> {
  //   return this.http.get<Equipe[]>(this.apiUrl);
  // }

  // a enlever quand on aura l'api !
  // Mock temporaire
  getEquipes(): Observable<Equipe[]> {
    const mockEquipes: Equipe[] = [
      { id: 1, nom: 'FC Barcelone', ville: 'Barcelone', stade: 'Camp Nou' },
      { id: 2, nom: 'Manchester City', ville: 'Manchester', stade: 'Etihad Stadium' }
    ];

    return new Observable(observer => {
      observer.next(mockEquipes);
      observer.complete();
    });
  }

  createEquipe(): void {
    this.http.post<Equipe>(this.apiUrl, this.newEquipe, this.authService.getBearer()).subscribe({
      next: (createdEquipe) => {
        this.listEquipes.push(createdEquipe);
        this.newEquipe = { nom: '', ville: '', stade: '' };
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = "Échec de la création. Vérifiez les champs ou vos permissions.";
        setTimeout(() => this.errorMessage = '', 4000);
      }
    });
  }

  editEquipe(equipe: Equipe): void {
    this.selectedEquipe = { ...equipe };
  }

  
  updateEquipe(): void {
    if (!this.selectedEquipe) return;

    const updateData = {
      nom: this.selectedEquipe.nom,
      ville: this.selectedEquipe.ville,
      stade: this.selectedEquipe.stade
    };

    this.http.patch<Equipe>(`${this.apiUrl}/${this.selectedEquipe.id}`, updateData, this.authService.getBearer()).subscribe({
      next: (updatedEquipe) => {
        this.listEquipes = this.listEquipes.map(e =>
          e.id === updatedEquipe.id ? updatedEquipe : e
        );
        this.selectedEquipe = null;
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = "Échec de la modification.";
        setTimeout(() => this.errorMessage = '', 4000);
      }
    });
  }

  deleteEquipe(id: number): void {
    this.http.delete<void>(`${this.apiUrl}/${id}`, this.authService.getBearer()).subscribe({
      next: () => {
        this.listEquipes = this.listEquipes.filter(e => e.id !== id);
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = "Échec de la suppression.";
        setTimeout(() => this.errorMessage = '', 4000);
      }
    });
  }

  get filteredEquipes(): Equipe[] {
    return this.filterService.filterData(this.listEquipes, this.searchTerm, 'nom');
  }
}
