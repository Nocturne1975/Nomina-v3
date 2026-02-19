import express from "express";
import cors, { type CorsOptions } from "cors";
import dotenv from "dotenv";

// Important!! en dev (ts-node): assure que l'augmentation Express (req.auth) est chargée.
import "./types/expressType";

import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import CategorieRoutes from "./routes/CategorieRoutes";
import CultureRoutes from "./routes/CultureRoutes";
import NomPersonnageRoutes from "./routes/NomPersonnageRoutes";
import FragmentsHistoireRoutes from "./routes/FragmentsHistoireRoutes";
import TitreRoutes from "./routes/TitreRoutes";
import ConceptRoutes from "./routes/ConceptRoutes";
import GenerateRoutes from "./routes/GenerateRoutes";
import UniversThematiqueRoutes from "./routes/UniversThematiqueRoutes";
import LieuxRoutes from "./routes/LieuxRoutes";
import NomFamilleRoutes from "./routes/NomFamilleRoutes";

dotenv.config();

const app = express();

app.use(express.json());

const corsOrigins = [
  "https://nomina-v3.vercel.app",
  "http://localhost:5173", // dev Vite
  "http://localhost:3000", // tests locaux
];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Certains contextes (Electron/file://) n'envoient pas d'en-tête Origin.
    if (!origin) return callback(null, true);

    if (corsOrigins.includes(origin)) return callback(null, true);

    return callback(new Error(`CORS: origin non autorisée: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// CORS pour toutes les requêtes
app.use(cors(corsOptions));

// Preflight
app.options("*", cors(corsOptions));

app.get("/", (_req, res) => res.send("Nomina-backend running"));
app.get("/healthz", (_req, res) => res.json({ ok: true }));

app.use("/generate", GenerateRoutes);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/categories", CategorieRoutes);
app.use("/cultures", CultureRoutes);
app.use("/nomPersonnages", NomPersonnageRoutes);
app.use("/prenoms", NomPersonnageRoutes);
app.use("/nomFamilles", NomFamilleRoutes);
app.use("/fragmentsHistoire", FragmentsHistoireRoutes);
app.use("/titres", TitreRoutes);
app.use("/concepts", ConceptRoutes);
app.use("/lieux", LieuxRoutes);
app.use("/univers", UniversThematiqueRoutes);

export default app;
