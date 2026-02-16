import { Culture } from "./Culture";
import { Categorie } from "./Categorie";

export interface FragmentsHistoire {
	id: number;
	texte: string;
	appliesTo?: string;
	genre?: string;
	minNameLength?: number;
	maxNameLength?: number;
	cultureId?: number;
	culture?: Culture;
	categorieId?: number;
	categorie?: Categorie;
	createdAt: Date;
	updatedAt: Date;
}
