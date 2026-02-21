export interface Creature {
  id: number;
  valeur: string;
  type?: string;
  description?: string;
  personnageId?: number;
  cultureId?: number;
  categorieId?: number;
  createdAt: Date;
  updatedAt: Date;
}
