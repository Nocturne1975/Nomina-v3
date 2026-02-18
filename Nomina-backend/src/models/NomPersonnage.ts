import { Culture } from "./Culture";
import { Categorie } from "./Categorie";

export interface Prenom {
  id: number;
  valeur?: string;
  genre?: string;
  cultureId?: number;
  culture?: Culture;
  categorieId?: number;
  categorie?: Categorie;
  createdAt: Date;
  updatedAt: Date;
}

export type NomPersonnage = Prenom;
