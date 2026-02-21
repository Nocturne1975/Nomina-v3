import { Prenom } from "./NomPersonnage";
import { Culture } from "./Culture";
import { Categorie } from "./Categorie";
import { Titre } from "./Titre";

type NomFamilleRef = {
  id: number;
  valeur?: string;
};

type CreatureRef = {
  id: number;
  valeur: string;
};

export interface Personnage {
  id: number;
  prenomId: number;
  prenom?: Prenom;
  nomFamilleId?: number;
  nomFamille?: NomFamilleRef;
  titreId?: number;
  titre?: Titre;
  genre?: string;
  biographie?: string;
  cultureId?: number;
  culture?: Culture;
  categorieId?: number;
  categorie?: Categorie;
  creatures?: CreatureRef[];
  createdAt: Date;
  updatedAt: Date;
}
