export interface Saison {
    id: number;
    // league_id: number;
    debut: string;            
    fin: string;              
    nb_equipe: number | null;
    nb_arbitre: number | null;
    nb_remplacement: number | null;
    league: number | null;
  }
  