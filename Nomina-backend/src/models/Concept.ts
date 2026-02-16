export interface Concept {
  id: number;
  valeur: string;
  type?: string;
  mood?: string;
  keywords?: string;
  categorieId?: number;
  createdAt: Date;
  updatedAt: Date;
}