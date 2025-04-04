import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FilterService } from '../../../services/filter.service';
import { FormsModule } from '@angular/forms';
import { Joueur } from '../../../interfaces/Joueur';

@Component({
  selector: 'app-joueurs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './joueurs.component.html',
  styleUrls: ['./joueurs.component.css']
})
export class JoueursComponent implements OnInit {

  private apiUrl = environment.apiUrl + '/joueurs';
  public listJoueurs: Joueur[] = [];
  searchTerm: string = '';
  errorMessage: string = '';
  selectedJoueur: Joueur | null = null;

  newJoueur = {
    nom: '',
    prenom: '',
    date_naissance: '',
    poste: '',
    equipe: ''
  };

  constructor(public authService: AuthService,private http: HttpClient,private filterService: FilterService) {}

  ngOnInit(): void {
    this.getJoueurs().subscribe(data => {
      this.listJoueurs = data;
    });
  }

  // a remettre
  // getLeagues(): Observable<Joueur[]> {
  //     return this.http.get<Joueur[]>(this.apiUrl);
  // }

  // a supprimer
  getJoueurs(): Observable<Joueur[]> {
    const mockJoueurs: Joueur[] = [
      {
        id: 10,
        nom: 'Messi',
        prenom: 'Lionel',
        date_naissance: '1987-06-24',
        poste: 'Attaquant',
        equipe: 'PSG'
      },
      {
        id: 11,
        nom: 'Cristiano',
        prenom: 'Ronaldo',
        date_naissance: '1985-02-05',
        poste: 'Attaquant',
        equipe: 'Manchester United'
      }
    ];

    return new Observable(observer => {
      observer.next(mockJoueurs);
      observer.complete();
    });
  }

  createJoueur(): void {
    this.http.post<Joueur>(this.apiUrl, this.newJoueur, this.authService.getBearer()).subscribe({
      next: (createdJoueur) => {
        this.listJoueurs.push(createdJoueur);
        this.newJoueur = {
          nom: '', prenom: '', date_naissance: '', poste: '', equipe: ''
        };
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = "Échec de la création. Vérifiez les champs ou vos permissions.";
        setTimeout(() => this.errorMessage = '', 4000);
      }
    });
  }

  editJoueur(joueur: Joueur): void {
    this.selectedJoueur = { ...joueur };
  }

  updateJoueur(): void {
    if (!this.selectedJoueur) return;

    const updateData = {
      nom: this.selectedJoueur.nom,
      prenom: this.selectedJoueur.prenom,
      date_naissance: this.selectedJoueur.date_naissance,
      poste: this.selectedJoueur.poste,
      equipe: this.selectedJoueur.equipe
    };

    this.http.patch<Joueur>(`${this.apiUrl}/${this.selectedJoueur.id}`, updateData, this.authService.getBearer()).subscribe({
      next: (updatedJoueur) => {
        this.listJoueurs = this.listJoueurs.map(j =>
          j.id === updatedJoueur.id ? updatedJoueur : j
        );
        this.selectedJoueur = null;
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = "Échec de la modification.";
        setTimeout(() => this.errorMessage = '', 4000);
      }
    });
  }

  deleteJoueur(id: number): void {
    this.http.delete<void>(`${this.apiUrl}/${id}`, this.authService.getBearer()).subscribe({
      next: () => {
        this.listJoueurs = this.listJoueurs.filter(j => j.id !== id);
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = "Échec de la suppression.";
        setTimeout(() => this.errorMessage = '', 4000);
      }
    });
  }

  get filteredJoueurs(): Joueur[] {
    return this.filterService.filterData(this.listJoueurs, this.searchTerm, 'nom');
  }
}
