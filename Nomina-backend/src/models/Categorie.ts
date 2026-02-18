import { Prenom } from "./NomPersonnage";
import { Lieux } from "./Lieux";
import { FragmentsHistoire } from "./FragmentsHistoire";
import { Titre } from "./Titre";
import { Concept } from "./Concept";
import { Personnage } from "./Personnage";

export interface Categorie {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  nomPersonnages?: Prenom[];
  personnages?: Personnage[];
  lieux?: Lieux[];
  fragmentsHistoire?: FragmentsHistoire[];
  titres?: Titre[];
  concepts?: Concept[];
}