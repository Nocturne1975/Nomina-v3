import { Culture } from "./Culture";
import { Categorie } from "./Categorie";

export interface Titre {
	id: number;
	valeur: string;
	type?: string;
	genre?: string;
	cultureId?: number;
	culture?: Culture;
	categorieId?: number;
	categorie?: Categorie;
	createdAt: Date;
	updatedAt: Date;
}
