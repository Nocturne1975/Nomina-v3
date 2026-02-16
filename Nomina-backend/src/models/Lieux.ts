import { Categorie } from "./Categorie";

export interface Lieux {
	id: number;
	value: string;
	type?: string;
	categorieId?: number;
	categorie?: Categorie;
	createdAt: Date;
	updatedAt: Date;
}
