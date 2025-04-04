import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FilterService } from '../../../services/filter.service';
import { FormsModule } from '@angular/forms';
import { Journee } from '../../../interfaces/Journee';

@Component({
  selector: 'app-journees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './journees.component.html',
  styleUrls: ['./journees.component.css']
})
export class JourneesComponent implements OnInit {

  private apiUrl = environment.apiUrl + '/journees';
  public listJournees: Journee[] = [];
  searchTerm: string = '';
  errorMessage: string = '';
  selectedJournee: Journee | null = null;

  newJournee = {
    saison_id: 0,
    numero: 0,
    debut: '',
    fin: ''
  };

  constructor(public authService: AuthService,private http: HttpClient,private filterService: FilterService) {}

  ngOnInit(): void {
    this.getJournees().subscribe(data => {
      this.listJournees = data;
    });
  }

  // a remettre et supprimer l'autre quand y'aura l'api
  // getSaison(): Observable<Journee[]> {
  //   return this.http.get<Journee[]>(this.apiUrl);
  // }

  // MOCK temporaire, à remplacer par un appel API réel
  getJournees(): Observable<Journee[]> {
    const mock: Journee[] = [
      { id: 1, saison_id: 2, numero: 1, debut: '2024-07-19', fin: '2024-12-28' },
      { id: 2, saison_id: 2, numero: 2, debut: '2024-08-01', fin: '2024-12-15' }
    ];

    return new Observable(observer => {
      observer.next(mock);
      observer.complete();
    });
  }

  createJournee(): void {
    this.http.post<Journee>(this.apiUrl, this.newJournee, this.authService.getBearer()).subscribe({
      next: (created) => {
        this.listJournees.push(created);
        this.newJournee = { saison_id: 0, numero: 0, debut: '', fin: '' };
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = "Erreur lors de la création.";
        setTimeout(() => this.errorMessage = '', 4000);
      }
    });
  }

  editJournee(j: Journee): void {
    this.selectedJournee = { ...j };
  }

  updateJournee(): void {
    if (!this.selectedJournee) return;

    const updateData = {
      saison_id: this.selectedJournee.saison_id,
      numero: this.selectedJournee.numero,
      debut: this.selectedJournee.debut,
      fin: this.selectedJournee.fin
    };

    this.http.patch<Journee>(`${this.apiUrl}/${this.selectedJournee.id}`, updateData, this.authService.getBearer()).subscribe({
      next: (updated) => {
        this.listJournees = this.listJournees.map(j => j.id === updated.id ? updated : j);
        this.selectedJournee = null;
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = "Erreur lors de la modification.";
        setTimeout(() => this.errorMessage = '', 4000);
      }
    });
  }

  deleteJournee(id: number): void {
    this.http.delete<void>(`${this.apiUrl}/${id}`, this.authService.getBearer()).subscribe({
      next: () => {
        this.listJournees = this.listJournees.filter(j => j.id !== id);
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = "Erreur lors de la suppression.";
        setTimeout(() => this.errorMessage = '', 4000);
      }
    });
  }

  get filteredJournees(): Journee[] {
    return this.filterService.filterData(this.listJournees, this.searchTerm, 'numero');
  }
}
