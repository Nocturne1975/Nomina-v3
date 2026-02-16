import { useEffect, useMemo, useState } from "react";
import { apiFetch, ApiError } from "../lib/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../components/ui/command";

import logoUrl from "../../assets/logo5.png";

function parseTitreTypeParts(type: string | null | undefined): { theme: string | null; section: string | null } {
  if (!type) return { theme: null, section: null };
  const raw = type.trim();
  if (!raw) return { theme: null, section: null };
  const parts = raw.split("—").map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) return { theme: parts[0], section: parts.slice(1).join(" — ") };
  return { theme: raw, section: null };
}

function normalizeGenreLabel(genre: string | null | undefined): "Masculin" | "Féminin" | "Neutre" | null {
  if (!genre) return null;
  const lc = genre.trim().toLowerCase();
  if (["m", "masculin", "male", "homme"].includes(lc)) return "Masculin";
  if (["f", "féminin", "feminin", "female", "femme"].includes(lc)) return "Féminin";
  if (["nb", "non-binaire", "non binaire", "nonbinaire", "neutre", "neutral"].includes(lc)) return "Neutre";
  return null;
}

function getTitreDescription(titre: { valeur: string; type?: string | null; genre?: string | null }): string {
  const valeur = titre.valeur.trim();
  const { theme, section } = parseTitreTypeParts(titre.type ?? null);

  const genreLabel = normalizeGenreLabel(titre.genre);
  const genreSuffix = genreLabel ? ` (${genreLabel})` : "";

  const lower = valeur.toLowerCase();
  const inTheme = (s: string) => (theme ?? "").toLowerCase().includes(s);
  const inSection = (s: string) => (section ?? "").toLowerCase().includes(s);

  // Descriptions plus précises pour quelques titres fréquents
  if (["comte", "comtesse"].includes(lower)) return `Titre nobiliaire: dirige (ou représente) un comté${genreSuffix}.`;
  if (["duc", "duchesse"].includes(lower)) return `Titre nobiliaire: rang élevé, lié à un duché${genreSuffix}.`;
  if (["baron", "baronne"].includes(lower)) return `Titre nobiliaire: seigneurie locale, souvent vassale${genreSuffix}.`;
  if (["marquis", "marquise"].includes(lower)) return `Titre nobiliaire: administration d'une marche/frontière${genreSuffix}.`;
  if (["seigneur", "dame"].includes(lower)) return `Titre féodal: autorité sur des terres et des sujets${genreSuffix}.`;

  // Descriptions par univers / thème
  if (inTheme("titres réels")) {
    if (inSection("administration") || inSection("état")) return `Fonction publique: gouverne, administre ou régule une institution${genreSuffix}.`;
    if (inSection("armée") || inSection("sécurité")) return `Grade ou rôle de sécurité: commande, protège ou assure l'ordre${genreSuffix}.`;
    if (inSection("médecine") || inSection("santé")) return `Profession de santé: soigne, diagnostique ou encadre des soins${genreSuffix}.`;
    if (inSection("éducation") || inSection("recherche")) return `Rôle académique: enseigne, encadre ou fait avancer la recherche${genreSuffix}.`;
    if (inSection("industrie") || inSection("technique")) return `Métier technique: conçoit, construit ou optimise des systèmes${genreSuffix}.`;
    return `Titre professionnel: rôle réaliste dans une organisation${genreSuffix}.`;
  }

  if (inTheme("médiév")) return `Titre médiéval: rang social ou fonction féodale${genreSuffix}.`;
  if (inTheme("fantasy")) return `Titre fantasy: rang, ordre ou fonction symbolique dans un univers imaginaire${genreSuffix}.`;
  if (inTheme("antique")) return `Titre antique: charge civique, militaire ou religieuse inspirée de l'Antiquité${genreSuffix}.`;
  if (inTheme("orient")) return `Titre oriental: rang politique/religieux inspiré des cours et empires orientaux${genreSuffix}.`;
  if (inTheme("steampunk")) return `Titre steampunk: rôle lié à la vapeur, aux mécaniques et aux guildes industrielles${genreSuffix}.`;
  if (inTheme("futur")) return `Titre SF: rang lié aux colonies, flottes ou institutions high-tech${genreSuffix}.`;
  if (inTheme("dracon")) return `Titre draconique: rang ou ordre associé aux dragons et aux pactes anciens${genreSuffix}.`;
  if (inTheme("relig")) return `Titre religieux: charge spirituelle ou hiérarchique au sein d'un culte${genreSuffix}.`;
  if (inTheme("maritime")) return `Titre maritime: rôle de commandement, navigation ou contrôle des ports${genreSuffix}.`;
  if (inTheme("polic")) return `Titre d'enquête: rôle d'investigation, d'autorité ou d'analyse criminelle${genreSuffix}.`;
  if (inTheme("mafia") || inTheme("crime")) return `Titre criminel: rang au sein d'un cartel, clan ou organisation clandestine${genreSuffix}.`;
  if (inTheme("mytholog")) return `Titre mythologique: rôle sacré, divin ou héroïque inspiré des panthéons${genreSuffix}.`;
  if (inTheme("post")) return `Titre post-apo: rôle de survie, leadership ou contrôle de ressources rares${genreSuffix}.`;

  return `Titre narratif: sert à situer le personnage dans la hiérarchie ou l'univers${genreSuffix}.`;
}

type Univers = { id: number; name: string };
type Categorie = { id: number; name: string; universId: number };
type Culture = { id: number; name: string };
type Concept = { id: number; valeur: string; categorieId: number | null };
type Titre = {
  id: number;
  valeur: string;
  type?: string | null;
  genre?: string | null;
  cultureId?: number | null;
  categorieId?: number | null;
};

type NpcResult = unknown;

type GenerateWhat = "npcs" | "lieux" | "nomPersonnages" | "fragmentsHistoire" | "titres" | "concepts";

export function GeneratePage() {
  const [loadingInit, setLoadingInit] = useState(true);
  const [loading, setLoading] = useState(false);

  const [univers, setUnivers] = useState<Univers[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [cultures, setCultures] = useState<Culture[]>([]);
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [titres, setTitres] = useState<Titre[]>([]);

  const [universId, setUniversId] = useState<number | "">("");
  const [categorieId, setCategorieId] = useState<number | "">("");
  const [cultureId, setCultureId] = useState<number | "">("");
  const [conceptId, setConceptId] = useState<number | "">("");
  const [conceptTopic, setConceptTopic] = useState<string>("");
  const [titreId, setTitreId] = useState<number | "">("");
  const [titrePickerOpen, setTitrePickerOpen] = useState(false);

  const [generateWhat, setGenerateWhat] = useState<GenerateWhat>("nomPersonnages");

  const [count, setCount] = useState(10);
  const [genre, setGenre] = useState<string>("");
  const [prefixe, setPrefixe] = useState("");

  const [result, setResult] = useState<NpcResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const supportsGenre = useMemo(() => {
    return (
      generateWhat === "npcs" ||
      generateWhat === "nomPersonnages" ||
      generateWhat === "fragmentsHistoire" ||
      generateWhat === "titres"
    );
  }, [generateWhat]);

  const supportsCulture = useMemo(() => {
    return (
      generateWhat === "npcs" ||
      generateWhat === "nomPersonnages" ||
      generateWhat === "fragmentsHistoire" ||
      generateWhat === "titres"
    );
  }, [generateWhat]);

  const supportsTitreChoice = useMemo(() => {
    return generateWhat === "npcs" || generateWhat === "nomPersonnages";
  }, [generateWhat]);

  const filteredCategories = useMemo(() => {
    if (universId === "") return categories;
    return categories.filter((c) => c.universId === universId);
  }, [categories, universId]);

  const filteredConcepts = useMemo(() => {
    if (categorieId === "") return concepts;
    return concepts.filter((c) => c.categorieId === categorieId);
  }, [concepts, categorieId]);

  const filteredTitres = useMemo(() => {
    if (!supportsTitreChoice) return [];

    const normalizeGenreVariants = (raw: string): Set<string> => {
      const lc = raw.trim().toLowerCase();
      const out = new Set<string>();
      const add = (s: string) => out.add(s.toLowerCase());
      if (["m", "masculin", "male", "homme"].includes(lc)) {
        ["m", "masculin", "male", "homme", "M", "Masculin"].forEach(add);
      } else if (["f", "féminin", "feminin", "female", "femme"].includes(lc)) {
        ["f", "féminin", "feminin", "female", "femme", "F", "Féminin"].forEach(add);
      } else if (["nb", "non-binaire", "non binaire", "nonbinaire", "neutre", "neutral"].includes(lc)) {
        ["nb", "non-binaire", "non binaire", "nonbinaire", "neutre", "neutral", "NB"].forEach(add);
      } else {
        add(raw);
      }
      return out;
    };

    const matchesGenre = (titreGenre: string | null | undefined) => {
      if (!genre) return true;
      // Si un titre n'est pas genré en DB, on l'affiche quand même.
      if (!titreGenre) return true;
      const want = normalizeGenreVariants(genre);
      const have = normalizeGenreVariants(titreGenre);
      for (const v of have) if (want.has(v)) return true;
      return false;
    };

    const allowedCategorieIds = new Set<number>(
      (universId === "" ? categories : categories.filter((c) => c.universId === universId)).map((c) => c.id)
    );

    return titres
      .filter((t) => {
        // Filtre univers/catégorie
        if (categorieId !== "") return (t.categorieId ?? null) === categorieId;
        if (universId !== "") return t.categorieId != null && allowedCategorieIds.has(t.categorieId);
        return true;
      })
      .filter((t) => {
        // Filtre culture
        if (cultureId === "") return true;
        return (t.cultureId ?? null) === cultureId;
      })
      .filter((t) => {
        // Filtre genre (si choisi)
        return matchesGenre(t.genre);
      })
      .sort((a, b) => a.valeur.localeCompare(b.valeur, "fr"));
  }, [supportsTitreChoice, titres, categories, universId, categorieId, cultureId, genre]);

  const filteredTitresGrouped = useMemo(() => {
    const map = new Map<string, Titre[]>();
    for (const t of filteredTitres) {
      const label = (t.type ?? "Autres").trim() || "Autres";
      const arr = map.get(label) ?? [];
      arr.push(t);
      map.set(label, arr);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b, "fr"))
      .map(([label, items]) => ({ label, items }));
  }, [filteredTitres]);

  const selectedTitre = useMemo(() => {
    if (titreId === "") return null;
    return titres.find((t) => t.id === titreId) ?? null;
  }, [titres, titreId]);

  const selectedUnivers = useMemo(() => {
    if (universId === "") return null;
    return univers.find((u) => u.id === universId) ?? null;
  }, [univers, universId]);

  const selectedCategorie = useMemo(() => {
    if (categorieId === "") return null;
    return categories.find((c) => c.id === categorieId) ?? null;
  }, [categories, categorieId]);

  const selectedCulture = useMemo(() => {
    if (cultureId === "") return null;
    return cultures.find((c) => c.id === cultureId) ?? null;
  }, [cultures, cultureId]);

  const selectedConcept = useMemo(() => {
    if (conceptId === "") return null;
    return concepts.find((c) => c.id === conceptId) ?? null;
  }, [concepts, conceptId]);

  const titreDescriptionById = useMemo(() => {
    const map = new Map<number, string>();
    for (const t of titres) {
      map.set(t.id, getTitreDescription(t));
    }
    return map;
  }, [titres]);

  const selectedTitreDescription = useMemo(() => {
    if (!selectedTitre) return null;
    return titreDescriptionById.get(selectedTitre.id) ?? getTitreDescription(selectedTitre);
  }, [selectedTitre, titreDescriptionById]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoadingInit(true);
      setError(null);
      try {
        const [u, cats, cults, conc] = await Promise.all([
          apiFetch<Univers[]>("/univers"),
          apiFetch<Categorie[]>("/categories"),
          apiFetch<Culture[]>("/cultures"),
          apiFetch<Concept[]>("/concepts"),
        ]);

        const t = await apiFetch<Titre[]>("/titres");

        if (cancelled) return;
        setUnivers(u);
        setCategories(cats);
        setCultures(cults);
        setConcepts(conc);
        setTitres(t);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof ApiError ? `${e.message} (HTTP ${e.status})` : String(e));
      } finally {
        if (!cancelled) setLoadingInit(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setCategorieId("");
    setConceptId("");
    setConceptTopic("");
    setTitreId("");
  }, [universId]);

  useEffect(() => {
    setConceptId("");
    setTitreId("");
  }, [categorieId]);

  useEffect(() => {
    setTitreId("");
  }, [cultureId, genre, generateWhat]);

  useEffect(() => {
    if (generateWhat !== "concepts") setConceptTopic("");
  }, [generateWhat]);
  
  async function onGenerate() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const endpointByWhat: Record<GenerateWhat, string> = {
        npcs: "/generate/npcs",
        lieux: "/generate/lieux",
        // L'intention UX: un personnage = nom + courte biographie.
        nomPersonnages: "/generate/nom-personnages",
        fragmentsHistoire: "/generate/fragments-histoire",
        titres: "/generate/titres",
        concepts: "/generate/concepts",
      };

      const endpoint = endpointByWhat[generateWhat];

      const qs = new URLSearchParams();
      qs.set("count", String(count));
      if (prefixe.trim()) qs.set("seed", prefixe.trim());

      if (supportsGenre && genre) qs.set("genre", genre);

      if (cultureId !== "" && supportsCulture) qs.set("cultureId", String(cultureId));
      if (categorieId !== "") qs.set("categorieId", String(categorieId));

      // Concepts: permet de sélectionner un concept précis.
      if (generateWhat === "concepts") {
        const trimmedTopic = conceptTopic.trim();
        if (trimmedTopic) {
          qs.set("topic", trimmedTopic);
        } else if (conceptId !== "") {
          qs.set("conceptId", String(conceptId));
        }
      }

      // Utile quand l'utilisateur choisit un univers mais pas une catégorie.
      if ((generateWhat === "npcs" || generateWhat === "nomPersonnages") && universId !== "") {
        qs.set("universId", String(universId));
      }

      if (supportsTitreChoice && titreId !== "") qs.set("titreId", String(titreId));

      // Si on génère des concepts, la catégorie sert de filtre principal.
      // (Sans catégorie, l'API retourne des concepts tous univers confondus.)

      const url = `${endpoint}?${qs.toString()}`;
      const data = await apiFetch<NpcResult>(url);
      setResult(data);
    } catch (e) {
      setError(e instanceof ApiError ? `${e.message} (HTTP ${e.status})` : String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-3xl text-[#2d1b4e] mb-6" style={{ fontFamily: "Cinzel, serif" }}>
        Génération
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulaire à gauche */}
        <Card className="p-4 border-[#d4c5f9] h-fit">
          <div className="grid gap-4">
            {loadingInit ? <p>Chargement des listes…</p> : null}

            <div>
              <label className="text-sm text-[#2d1b4e]">Univers Thématique</label>
              <select
                value={universId}
                onChange={(e) => setUniversId(e.target.value ? Number(e.target.value) : "")}
                className="mt-2 w-full h-9 rounded-md border border-[#d4c5f9] bg-white px-3 text-sm"
              >
                <option value="">— Tous —</option>
                {univers.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-[#2d1b4e]">Catégorie</label>
              <select
                value={categorieId}
                onChange={(e) => setCategorieId(e.target.value ? Number(e.target.value) : "")}
                className="mt-2 w-full h-9 rounded-md border border-[#d4c5f9] bg-white px-3 text-sm"
              >
                <option value="">— Toutes —</option>
                {filteredCategories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-[#2d1b4e]">Quelle Culture</label>
              <select
                value={cultureId}
                onChange={(e) => setCultureId(e.target.value ? Number(e.target.value) : "")}
                className="mt-2 w-full h-9 rounded-md border border-[#d4c5f9] bg-white px-3 text-sm"
              >
                <option value="">— Toutes —</option>
                {cultures.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {generateWhat === "concepts" ? (
              <div>
                <label className="text-sm text-[#2d1b4e]">Sujet / produit (optionnel)</label>
                <Input
                  value={conceptTopic}
                  onChange={(e) => {
                    const next = e.target.value;
                    setConceptTopic(next);
                    if (next.trim()) setConceptId("");
                  }}
                  placeholder="Ex: chaussures, café, application de fitness…"
                  className="mt-2"
                />
                <p className="mt-1 text-xs text-[#6b5aa3]">
                  Si vous renseignez un sujet, l'API génère des concepts « réalistes » (brief marketing) même si la base de données n'a pas de concepts.
                </p>

                <label className="text-sm text-[#2d1b4e]">Quel Concept</label>
                <select
                  value={conceptId}
                  onChange={(e) => {
                    setConceptId(e.target.value ? Number(e.target.value) : "");
                    setConceptTopic("");
                  }}
                  disabled={conceptTopic.trim().length > 0}
                  className="mt-2 w-full h-9 rounded-md border border-[#d4c5f9] bg-white px-3 text-sm"
                >
                  <option value="">— Tous —</option>
                  {filteredConcepts.map((c) => (
                    <option key={c.id} value={c.id}>{c.valeur}</option>
                  ))}
                </select>
                {categorieId !== "" && filteredConcepts.length === 0 ? (
                  <p className="mt-1 text-xs text-[#6b5aa3]">
                    Aucun concept n'est associé à cette catégorie pour l'instant. La génération utilisera tous les concepts disponibles.
                  </p>
                ) : null}
              </div>
            ) : null}

            <div>
              <label className="text-sm text-[#2d1b4e]">Que voulez-vous générer ?</label>
              <select
                value={generateWhat}
                onChange={(e) => setGenerateWhat(e.target.value as GenerateWhat)}
                className="mt-2 w-full h-9 rounded-md border border-[#d4c5f9] bg-white px-3 text-sm"
              >
                <option value="npcs">🧙 Biographie (PNJ complet)</option>
                <option value="nomPersonnages">👤 Personnage (nom + courte biographie)</option>
                <option value="lieux">🏛️ Lieux</option>
                <option value="concepts">💡 Concepts</option>
                <option value="fragmentsHistoire">📜 Fragments d'histoire</option>
                <option value="titres">👑 Titres</option>
              </select>
            </div>

            {supportsGenre ? (
              <div>
                <label className="text-sm text-[#2d1b4e]">Genre (optionnel)</label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="mt-2 w-full h-9 rounded-md border border-[#d4c5f9] bg-white px-3 text-sm"
                >
                  <option value="">— Tous —</option>
                  <option value="masculin">Masculin</option>
                  <option value="feminin">Féminin</option>
                  <option value="nb">Non-binaire</option>
                </select>
              </div>
            ) : null}

            {supportsTitreChoice ? (
              <div>
                <label className="text-sm text-[#2d1b4e]">Titre (optionnel)</label>
                <Popover open={titrePickerOpen} onOpenChange={setTitrePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-2 w-full justify-between border-[#d4c5f9] bg-white text-[#2d1b4e]"
                    >
                      <span className="truncate">
                        {selectedTitre ? selectedTitre.valeur : "— Aucun —"}
                      </span>
                      <span className="ml-2 text-[#c5bfd9]">⌄</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[340px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Rechercher un titre…" />
                      <CommandList>
                        <CommandEmpty>Aucun titre trouvé.</CommandEmpty>

                        <CommandGroup>
                          <CommandItem
                            value="__none__"
                            onSelect={() => {
                              setTitreId("");
                              setTitrePickerOpen(false);
                            }}
                          >
                            — Aucun —
                          </CommandItem>
                        </CommandGroup>

                        {filteredTitresGrouped.map((group) => (
                          <CommandGroup key={group.label} heading={group.label}>
                            {group.items.map((t) => (
                              <CommandItem
                                key={t.id}
                                value={`${t.valeur} ${group.label}`}
                                onSelect={() => {
                                  setTitreId(t.id);
                                  setTitrePickerOpen(false);
                                }}
                              >
                                <div className="flex flex-col">
                                  <span className="truncate">{t.valeur}</span>
                                  <span className="text-xs text-[#6b5aa3] truncate">
                                    {titreDescriptionById.get(t.id) ?? getTitreDescription(t)}
                                  </span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        ))}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {selectedTitreDescription ? (
                  <p className="mt-1 text-xs text-[#6b5aa3]">{selectedTitreDescription}</p>
                ) : null}
                <p className="mt-1 text-xs text-[#c5bfd9]">
                  Exemple: choisir “Comte” + genre “Masculin” pour forcer un personnage “Comte Nom”.
                </p>
              </div>
            ) : null}

            <div>
              <label className="text-sm text-[#2d1b4e]">Nombre</label>
              <Input type="number" value={count} min={1} max={200} onChange={(e) => setCount(Number(e.target.value))} />
            </div>

            <div>
              <label className="text-sm text-[#2d1b4e]">Préfixe (optionnel)</label>
              <Input value={prefixe} onChange={(e) => setPrefixe(e.target.value)} placeholder="Ex: Ael / Nova / Val" />
            </div>

            <Button onClick={onGenerate} disabled={loading || loadingInit} className="bg-[#7b3ff2] hover:bg-[#a67be8] text-white">
              {loading ? "Génération…" : "Générer (API)"}
            </Button>

            {error ? <p className="text-red-700">{error}</p> : null}
          </div>
        </Card>

        {/* Résultats à droite */}
        <div>
          {result ? (
            <div className="bg-white border border-[#d4c5f9] rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#2d1b4e] mb-2" style={{ fontFamily: "Cinzel, serif" }}>
                ✨ Vos créations narratives
              </h3>
              <p className="text-sm text-[#6b5aa3] mb-4">
                Découvrez les éléments générés pour enrichir votre univers
              </p>
              
              <div className="flex flex-wrap gap-3 mb-4 p-3 bg-[#f8f6fc] rounded-md">
                {(result as any).seed && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#7b3ff2]">🎲 Préfixe:</span>
                    <code className="text-xs bg-white px-2 py-1 rounded border border-[#d4c5f9] text-[#2d1b4e]">
                      {(result as any).seed}
                    </code>
                  </div>
                )}
                {(result as any).count !== undefined && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#7b3ff2]">📊 Générés:</span>
                    <span className="text-xs font-bold text-[#2d1b4e]">{(result as any).count}</span>
                  </div>
                )}

                {/* Résumé des filtres */}
                {selectedUnivers ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#7b3ff2]">🌌 Univers:</span>
                    <span className="text-xs bg-white px-2 py-1 rounded border border-[#d4c5f9] text-[#2d1b4e]">
                      {selectedUnivers.name}
                    </span>
                  </div>
                ) : null}

                {selectedCategorie ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#7b3ff2]">📁 Catégorie:</span>
                    <span className="text-xs bg-white px-2 py-1 rounded border border-[#d4c5f9] text-[#2d1b4e]">
                      {selectedCategorie.name}
                    </span>
                  </div>
                ) : null}

                {selectedCulture ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#7b3ff2]">🌍 Culture:</span>
                    <span className="text-xs bg-white px-2 py-1 rounded border border-[#d4c5f9] text-[#2d1b4e]">
                      {selectedCulture.name}
                    </span>
                  </div>
                ) : null}

                {supportsGenre && genre ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#7b3ff2]">⚧️ Genre:</span>
                    <span className="text-xs bg-white px-2 py-1 rounded border border-[#d4c5f9] text-[#2d1b4e]">
                      {genre}
                    </span>
                  </div>
                ) : null}

                {supportsTitreChoice && selectedTitre ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#7b3ff2]">👑 Titre:</span>
                    <span className="text-xs bg-white px-2 py-1 rounded border border-[#d4c5f9] text-[#2d1b4e]">
                      {selectedTitre.valeur}
                    </span>
                  </div>
                ) : null}

                {generateWhat === "concepts" && selectedConcept ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#7b3ff2]">💡 Concept:</span>
                    <span className="text-xs bg-white px-2 py-1 rounded border border-[#d4c5f9] text-[#2d1b4e]">
                      {selectedConcept.valeur}
                    </span>
                  </div>
                ) : null}

                {generateWhat === "concepts" && conceptTopic.trim() ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#7b3ff2]">🎯 Sujet:</span>
                    <span className="text-xs bg-white px-2 py-1 rounded border border-[#d4c5f9] text-[#2d1b4e]">
                      {conceptTopic.trim()}
                    </span>
                  </div>
                ) : null}
              </div>

              {(result as any).warning && (
                <div className="bg-orange-50 border-l-4 border-orange-400 text-orange-800 px-4 py-3 rounded-r-md mb-4 flex items-start gap-3">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <p className="font-medium">Attention</p>
                    <p className="text-sm">{(result as any).warning}</p>
                  </div>
                </div>
              )}

              {(result as any).items && Array.isArray((result as any).items) && (result as any).items.length > 0 ? (
                <div className="max-h-[calc(100vh-350px)] overflow-y-auto pr-2">
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {(result as any).items.map((item: any, idx: number) => {
                      const title = (() => {
                        switch (generateWhat) {
                          case "npcs":
                          case "nomPersonnages":
                            return item.name ?? "Personnage";
                          case "lieux":
                            return item.value ?? "Lieu";
                          case "fragmentsHistoire":
                            return item.appliesTo ? `Fragment (${item.appliesTo})` : "Fragment";
                          case "titres":
                            return item.valeur ?? "Titre";
                          case "concepts":
                            return item.valeur ?? "Concept";
                          default:
                            return "Résultat";
                        }
                      })();

                      const description = (() => {
                        const clamp = (s: string, n = 180) => (s.length > n ? `${s.slice(0, n).trim()}…` : s);
                        switch (generateWhat) {
                          case "npcs":
                            return item.backstory ? clamp(String(item.backstory), 220) : "Biographie générée pour votre univers.";
                          case "nomPersonnages":
                            return item.miniBio
                              ? clamp(String(item.miniBio), 360)
                              : "Nom + mini-biographie (format court).";
                          case "lieux":
                            return item.type ? `Type: ${item.type}` : "Lieu prêt à être intégré à votre monde.";
                          case "fragmentsHistoire":
                            return item.texte ? clamp(String(item.texte), 220) : "Fragment narratif.";
                          case "titres":
                            return item.valeur
                              ? getTitreDescription({ valeur: String(item.valeur), type: item.type ?? null, genre: item.genre ?? null })
                              : (item.type ? `Type: ${item.type}` : "Un titre pour enrichir vos personnages et factions.");
                          case "concepts":
                            return item.elevatorPitch
                              ? clamp(String(item.elevatorPitch), 220)
                              : item.mood
                                ? `Ambiance: ${item.mood}`
                                : "Un concept pour déclencher des idées.";
                          default:
                            return "";
                        }
                      })();

                      return (
                        <Card
                          key={idx}
                          className="bg-white border-[#d4c5f9] overflow-hidden hover:shadow-xl hover:shadow-[#7b3ff2]/10 transition-all duration-300 group"
                        >
                          <div className="p-6">
                            <div className="flex items-start gap-3 mb-4">
                              <div className="h-10 w-10 rounded-full bg-[#f8f6fc] border border-[#d4c5f9] flex items-center justify-center shrink-0">
                                <img src={logoUrl} alt="Nomina" className="h-7 w-7 object-contain" />
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="flex items-center justify-center w-7 h-7 bg-[#7b3ff2] text-white text-xs font-bold rounded-full shrink-0">
                                    {idx + 1}
                                  </span>
                                  <h4
                                    className="text-xl text-[#2d1b4e] truncate"
                                    style={{ fontFamily: "Cinzel, serif" }}
                                    title={title}
                                  >
                                    {title}
                                  </h4>
                                </div>
                              </div>
                            </div>

                            <p className="text-sm text-[#c5bfd9] leading-relaxed min-h-[3.5rem]">
                              {description}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-4">
                              <Badge className="bg-[#d4c5f9] text-[#2d1b4e] hover:bg-[#a67be8]">
                                {generateWhat === "npcs"
                                  ? "PNJ"
                                  : generateWhat === "nomPersonnages"
                                    ? "Personnage"
                                    : generateWhat === "lieux"
                                      ? "Lieu"
                                      : generateWhat === "fragmentsHistoire"
                                        ? "Fragment"
                                        : generateWhat === "titres"
                                          ? "Titre"
                                          : "Concept"}
                              </Badge>
                              {item.genre ? (
                                <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">Genre: {item.genre}</Badge>
                              ) : null}
                              {item.type ? (
                                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">Type: {item.type}</Badge>
                              ) : null}
                              {item.cultureId ? (
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Culture #{item.cultureId}</Badge>
                              ) : null}
                              {item.categorieId ? (
                                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200">Catégorie #{item.categorieId}</Badge>
                              ) : null}
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>

                  <div className="mt-10 flex justify-center">
                    <img
                      src={logoUrl}
                      alt="Nomina"
                      className="w-44 sm:w-56 md:w-64 opacity-20 select-none"
                      draggable={false}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">📭</div>
                  <p className="text-[#6b5aa3] font-medium">Aucun récit à raconter pour l'instant</p>
                  <p className="text-sm text-[#c5bfd9] mt-1">Ajustez vos filtres et lancez la magie narrative</p>
                </div>
              )}

              <details className="mt-6 border-t border-[#d4c5f9] pt-4">
                <summary className="text-sm text-[#7b3ff2] cursor-pointer hover:text-[#a67be8] font-medium flex items-center gap-2">
                  <span>🔧</span> Mode développeur : voir le JSON brut
                </summary>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-md overflow-auto text-xs mt-3 border border-gray-700 max-h-96 font-mono">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </details>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-white to-[#f8f6fc] border-2 border-dashed border-[#d4c5f9] rounded-lg p-8 shadow-sm text-center">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-lg font-semibold text-[#2d1b4e] mb-2" style={{ fontFamily: "Cinzel, serif" }}>
                Prêt à créer ?
              </h3>
              <p className="text-[#6b5aa3] text-sm">
                Configurez vos filtres et lancez la génération.<br />
                Les résultats apparaîtront ici comme par magie.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}