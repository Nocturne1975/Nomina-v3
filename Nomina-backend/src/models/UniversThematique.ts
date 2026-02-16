import { Categorie } from "./Categorie";


export interface UniversThematique {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  categories?: Categorie[];
}
