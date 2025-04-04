import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FilterService } from '../../../services/filter.service';
import { FormsModule } from '@angular/forms';
import { Officiel } from '../../../interfaces/Officiel';

@Component({
  selector: 'app-officiels',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './officiels.component.html',
  styleUrls: ['./officiels.component.css']
})
export class OfficielsComponent implements OnInit {

  private apiUrl = environment.apiUrl + '/officiels';
  public listOfficiels: Officiel[] = [];
  searchTerm: string = '';
  errorMessage: string = '';
  selectedOfficiel: Officiel | null = null;

  newOfficiel = {
    nom: '',
    prenom: '',
    role: ''
  };

  constructor(
    public authService: AuthService,
    private http: HttpClient,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.getOfficiels().subscribe(data => {
      this.listOfficiels = data;
    });
  }

      // a remettre
  // getLeagues(): Observable<Officiel[]> {
  //     return this.http.get<Officiel[]>(this.apiUrl);
  // }

  // À supprimer quand l'API est prête
  getOfficiels(): Observable<Officiel[]> {
    const mockOfficiels: Officiel[] = [
      { id: 1, nom: 'Michel', prenom: 'Declau', role: 'Arbitre Vidéo' },
      { id: 2, nom: 'Dupont', prenom: 'Jean', role: 'Officiel' }
    ];

    return new Observable(observer => {
      observer.next(mockOfficiels);
      observer.complete();
    });
  }

  createOfficiel(): void {
    this.http.post<Officiel>(this.apiUrl, this.newOfficiel, this.authService.getBearer()).subscribe({
      next: (created) => {
        this.listOfficiels.push(created);
        this.newOfficiel = { nom: '', prenom: '', role: '' };
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = "Échec de la création.";
        setTimeout(() => this.errorMessage = '', 4000);
      }
    });
  }

  editOfficiel(officiel: Officiel): void {
    this.selectedOfficiel = { ...officiel };
  }

  updateOfficiel(): void {
    if (!this.selectedOfficiel) return;

    const updateData = {
      nom: this.selectedOfficiel.nom,
      prenom: this.selectedOfficiel.prenom,
      role: this.selectedOfficiel.role
    };

    this.http.patch<Officiel>(`${this.apiUrl}/${this.selectedOfficiel.id}`, updateData, this.authService.getBearer()).subscribe({
      next: (updated) => {
        this.listOfficiels = this.listOfficiels.map(o =>
          o.id === updated.id ? updated : o
        );
        this.selectedOfficiel = null;
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = "Échec de la modification.";
        setTimeout(() => this.errorMessage = '', 4000);
      }
    });
  }

  deleteOfficiel(id: number): void {
    this.http.delete<void>(`${this.apiUrl}/${id}`, this.authService.getBearer()).subscribe({
      next: () => {
        this.listOfficiels = this.listOfficiels.filter(o => o.id !== id);
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = "Échec de la suppression.";
        setTimeout(() => this.errorMessage = '', 4000);
      }
    });
  }

  get filteredOfficiels(): Officiel[] {
    return this.filterService.filterData(this.listOfficiels, this.searchTerm, 'nom');
  }
}
