import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FilterService } from '../../../services/filter.service';
import { FormsModule } from '@angular/forms';
import { Match } from '../../../interfaces/Match';

@Component({
  selector: 'app-matchs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './matchs.component.html',
  styleUrls: ['./matchs.component.css']
})
export class MatchsComponent implements OnInit {

  private apiUrl = environment.apiUrl + '/matchs';
  public listMatchs: Match[] = [];
  searchTerm: string = '';
  errorMessage: string = '';
  selectedMatch: Match | null = null;

  newMatch = {
    date: '',
    equipe_domicile: '',
    score: '',
    equipe_exterieur: ''
  };

  constructor(public authService: AuthService, private http: HttpClient, private filterService: FilterService) {}

  ngOnInit(): void {
    this.getMatchs().subscribe(data => {
      this.listMatchs = data;
    });
  }

  // A remettre quand on aura l'api !! et enlever celui d'en bas
  // getMatchs(): Observable<Matchs[]> {
  //   return this.http.get<Matchs[]>(this.apiUrl);
  // }

  // simulation en attendant l'api fonctionnel
  getMatchs(): Observable<Match[]> {
    const mockMatchs: Match[] = [
      {
        id: 1,
        date: '2024-04-01',
        equipe_domicile: 'FC Barcelone',
        score: '3 - 1',
        equipe_exterieur: 'Chelsea'
      },
      {
        id: 2,
        date: '2024-04-10',
        equipe_domicile: 'Real Madrid',
        score: '2 - 2',
        equipe_exterieur: 'Bayern Munich'
      }
    ];
  
    return new Observable(observer => {
      observer.next(mockMatchs);
      observer.complete();
    });
  }

  createMatch(): void {
    this.http.post<Match>(this.apiUrl, this.newMatch, this.authService.getBearer()).subscribe({
      next: (createdMatch) => {
        this.listMatchs.push(createdMatch);
        this.newMatch = { date: '', equipe_domicile: '', score: '', equipe_exterieur: '' };
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = "Échec de la création. Vérifiez les champs ou vos permissions.";
        setTimeout(() => this.errorMessage = '', 4000);
      }
    });
  }

  editMatch(match: Match): void {
    this.selectedMatch = { ...match };
  }

  updateMatch(): void {
    if (!this.selectedMatch) return;

    const updateData = {
      date: this.selectedMatch.date,
      equipe_domicile: this.selectedMatch.equipe_domicile,
      score: this.selectedMatch.score,
      equipe_exterieur: this.selectedMatch.equipe_exterieur
    };

    this.http.patch<Match>(`${this.apiUrl}/${this.selectedMatch.id}`, updateData, this.authService.getBearer()).subscribe({
      next: (updatedMatch) => {
        this.listMatchs = this.listMatchs.map(match =>
          match.id === updatedMatch.id ? updatedMatch : match
        );
        this.errorMessage = '';
        this.selectedMatch = null;
      },
      error: () => {
        this.errorMessage = "Échec de la modification. Vérifiez vos permissions.";
        setTimeout(() => this.errorMessage = '', 4000);
      }
    });
  }

  deleteMatch(id: number): void {
    this.http.delete<void>(`${this.apiUrl}/${id}`, this.authService.getBearer()).subscribe({
      next: () => {
        this.listMatchs = this.listMatchs.filter(match => match.id !== id);
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = "Échec de la suppression. Vous n'avez pas le droit.";
        setTimeout(() => this.errorMessage = '', 4000);
      }
    });
  }

  get filteredMatchs(): Match[] {
    return this.filterService.filterData(this.listMatchs, this.searchTerm, 'equipe_domicile');
  }
}
