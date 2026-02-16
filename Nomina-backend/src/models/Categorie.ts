import { NomPersonnage } from "./NomPersonnage";
import { Lieux } from "./Lieux";
import { FragmentsHistoire } from "./FragmentsHistoire";
import { Titre } from "./Titre";
import { Concept } from "./Concept";

export interface Categorie {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  nomPersonnages?: NomPersonnage[];
  lieux?: Lieux[];
  fragmentsHistoire?: FragmentsHistoire[];
  titres?: Titre[];
  concepts?: Concept[];
}