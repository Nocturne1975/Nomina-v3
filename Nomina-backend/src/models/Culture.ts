import { Prenom } from "./NomPersonnage";
import { FragmentsHistoire } from "./FragmentsHistoire";
import { Titre } from "./Titre";
import { Personnage } from "./Personnage";

export interface Culture {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  nomPersonnages?: Prenom[];
  personnages?: Personnage[];
  fragmentsHistoire?: FragmentsHistoire[];
  titres?: Titre[];
}
