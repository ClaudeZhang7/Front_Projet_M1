import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FilterService } from '../../../services/filter.service';
import { FormsModule } from '@angular/forms'; 
import { Saison } from '../../../interfaces/Saison';

@Component({
  selector: 'app-saisons',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './saisons.component.html',
  styleUrl: './saisons.component.css'
})
export class SaisonsComponent implements OnInit {
  private apiUrl = environment.apiUrl + '/saisons';
  public listSaisons: Saison[] = []; 
  searchTerm: string = '';
  errorMessage: string = ''; 
  
  // valeur pour l'ajout
  newSaison = {
    debut: '',
    fin: '',
    nb_equipes: 0,
    nb_arbitres: 0,
    nb_remplacements: 0
  };

  // valeur pour la modif
  selectedSaison: Saison | null = null;
  

  constructor(public authService: AuthService, private http: HttpClient, private filterService : FilterService) {}

  ngOnInit(): void {
    console.log("lancé");
    this.getSaison().subscribe(data => {
      this.listSaisons = data;
    });
  }

  // a remettre et supprimer l'autre quand y'aura l'api
  // getSaison(): Observable<Saison[]> {
  //   return this.http.get<Saison[]>(this.apiUrl);
  // }

  getSaison(): Observable<Saison[]> {
      const mockMatchs: Saison[] = [
        {
          id: 1,
          league_id: 1,
          debut: "2024-04-01",            
          fin: "2024-04-01",              
          nb_equipes: 20,
          nb_arbitres: 15,
          nb_remplacements: 5
        },
        {
          id: 2,
          league_id: 2,
          debut: "2024-04-01",            
          fin: "2024-04-01",              
          nb_equipes: 22,
          nb_arbitres: 10,
          nb_remplacements: 9
        }
      ];
    
      return new Observable(observer => {
        observer.next(mockMatchs);
        observer.complete();
      });
    }

  createSaison(): void {
    this.http.post<Saison>(this.apiUrl, this.newSaison, this.authService.getBearer()).subscribe({
      next: (createdSaison) => {
        this.listSaisons.push(createdSaison); 
        this.newSaison = { debut: '', fin: '', nb_equipes : 0, nb_arbitres : 0, nb_remplacements: 0 };
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
  

  editSaison(saison : Saison): void {
    this.selectedSaison = { 
      ...saison
    }; 
  }

  updateSaison(): void {
    if (!this.selectedSaison) return;
  
    const updateData = {
      debut: this.selectedSaison.debut,
      fin: this.selectedSaison.fin,
      nb_equipes : this.selectedSaison.nb_equipes,
      nb_arbitres : this.selectedSaison.nb_arbitres,
      nb_remplacements : this.selectedSaison.nb_remplacements
    };
  
    this.http.patch<Saison>(`${this.apiUrl}/${this.selectedSaison.id}`,updateData, this.authService.getBearer()).subscribe({
      next: (updatedsaison) => {
  
        this.listSaisons = this.listSaisons.map(saison =>
          saison.id === updatedsaison.id ? updatedsaison : saison
        );
  
        this.errorMessage = '';
        this.selectedSaison = null;
      },
      error: (err) => {
  
        this.errorMessage = "Échec de la modification. Vérifiez vos permissions.";
        setTimeout(() => {
          this.errorMessage = '';
        }, 4000);
      }
    });
  }
  
  deleteSaison(id: number): void {

    this.http.delete<void>(`${this.apiUrl}/${id}`, this.authService.getBearer()).subscribe({
      next: () => {
        this.listSaisons = this.listSaisons.filter(saison => saison.id !== id);
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
  
  get filteredSaisons(): Saison[] {
    return this.filterService.filterData(this.listSaisons, this.searchTerm, 'id');
  }

}
