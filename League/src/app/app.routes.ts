import { Routes } from '@angular/router';
import { LiguesComponent } from './components/pages/ligues/ligues.component';
import { SaisonsComponent } from './components/pages/saisons/saisons.component';

export const routes: Routes = [

  { path: 'ligues', component: LiguesComponent },
  { path: 'saisons', component: SaisonsComponent },
  { path: '', redirectTo: 'ligues', pathMatch: 'full' }
];

