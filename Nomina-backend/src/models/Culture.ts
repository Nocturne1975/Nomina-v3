import { NomPersonnage } from "./NomPersonnage";
import { FragmentsHistoire } from "./FragmentsHistoire";
import { Titre } from "./Titre";

export interface Culture {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  nomPersonnages?: NomPersonnage[];
  fragmentsHistoire?: FragmentsHistoire[];
  titres?: Titre[];
}
