import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ligue } from '../../../interfaces/Ligues';
import { FilterService } from '../../../services/filter.service';
import { FormsModule } from '@angular/forms'; // Import du FormsModule

@Component({
  selector: 'app-ligues',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ligues.component.html',
  styleUrls: ['./ligues.component.css'] 
})
export class LiguesComponent implements OnInit { 

  private apiUrl = environment.apiUrl + '/leagues';
  public listLeagues: Ligue[] = []; 
  searchTerm: string = '';
  errorMessage: string = ''; 
  selectedLeague: Ligue | null = null;
  newLeague = { display_name: '', country: ''};  



  constructor(public authService: AuthService, private http: HttpClient, private filterService : FilterService) {}

  ngOnInit(): void {
    this.getLeagues().subscribe(data => {
      this.listLeagues = data;
    });
  }

  getLeagues(): Observable<Ligue[]> {
    return this.http.get<Ligue[]>(this.apiUrl);
  }

  createLeague(): void {
    this.http.post<Ligue>(this.apiUrl, this.newLeague, this.authService.getBearer()).subscribe({
      next: (createdLeague) => {
        this.listLeagues.push(createdLeague); // Ajout direct à la liste
        this.newLeague = { display_name: '', country: '' }; // Réinitialise le formulaire
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = "Échec de la création. Vérifiez les champs ou vos permissions.";
  
        setTimeout(() => {
          this.errorMessage = '';
        }, 4000);
      }
    });
  }
  

  editLeague(league: Ligue): void {
    this.selectedLeague = { 
      ...league
    }; 
  }

  updateLeague(): void {
    if (!this.selectedLeague) return;
  
    const updateData = {
      display_name: this.selectedLeague.display_name,
      country: this.selectedLeague.country
    };
  
    this.http.patch<Ligue>(`${this.apiUrl}/${this.selectedLeague.id}`,updateData, this.authService.getBearer()).subscribe({
      next: (updatedLeague) => {
  
        this.listLeagues = this.listLeagues.map(league =>
          league.id === updatedLeague.id ? updatedLeague : league
        );
  
        this.errorMessage = '';
        this.selectedLeague = null;
      },
      error: (err) => {
  
        this.errorMessage = "Échec de la modification. Vérifiez vos permissions.";
        setTimeout(() => {
          this.errorMessage = '';
        }, 4000);
      }
    });
  }
  
  deleteLeague(id: number): void {

    this.http.delete<void>(`${this.apiUrl}/${id}`, this.authService.getBearer()).subscribe({
      next: () => {
        this.listLeagues = this.listLeagues.filter(league => league.id !== id);
        this.errorMessage = ''; 
      },
      error: (err) => {
        this.errorMessage = "Échec de la suppression. Vous n'avez pas le droit";
        setTimeout(() => {
          this.errorMessage = '';
        }, 4000);
      }
    });
  }
  
  get filteredLeagues(): Ligue[] {
    return this.filterService.filterData(this.listLeagues, this.searchTerm, 'display_name');
  }

}
