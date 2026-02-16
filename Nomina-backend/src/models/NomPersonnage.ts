import { Culture } from "./Culture";
import { Categorie } from "./Categorie";

export interface NomPersonnage {
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
