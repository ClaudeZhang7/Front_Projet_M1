import { Routes } from '@angular/router';
import { LiguesComponent } from './components/pages/ligues/ligues.component';
import { SaisonsComponent } from './components/pages/saisons/saisons.component';
import { JourneesComponent } from './components/pages/journees/journees.component';
import { MatchsComponent } from './components/pages/matchs/matchs.component';
import { EquipesComponent } from './components/pages/equipes/equipes.component';
import { JoueursComponent } from './components/pages/joueurs/joueurs.component';
import { ArbitresComponent } from './components/pages/arbitres/arbitres.component';
import { ChiffresClefsComponent } from './components/pages/chiffres-clefs/chiffres-clefs.component';
import { LoginComponent } from './components/pages/login/login.component';



export const routes: Routes = [
  { path: 'ligues', component: LiguesComponent },
  { path: 'saisons', component: SaisonsComponent },
  { path: 'journees', component: JourneesComponent },
  { path: 'matchs', component: MatchsComponent },
  { path: 'equipes', component: EquipesComponent },
  { path: 'joueurs', component: JoueursComponent },
  { path: 'arbitres', component: ArbitresComponent },
  { path: 'chiffres-clefs', component: ChiffresClefsComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'ligues', pathMatch: 'full' },
  { path: '**', redirectTo: 'ligues', pathMatch: 'full' }
];
