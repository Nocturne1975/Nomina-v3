import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes'
import authRoutes from './routes/authRoutes'
import CategorieRoutes from './routes/CategorieRoutes';
import CultureRoutes from './routes/CultureRoutes';
import NomPersonnageRoutes from './routes/NomPersonnageRoutes';
import FragmentsHistoireRoutes from './routes/FragmentsHistoireRoutes';
import TitreRoutes from './routes/TitreRoutes';
import ConceptRoutes from './routes/ConceptRoutes';
import GenerateRoutes from './routes/GenerateRoutes';
import UniversThematiqueRoutes from './routes/UniversThematiqueRoutes';
import LieuxRoutes from './routes/LieuxRoutes';
import NomFamilleRoutes from './routes/NomFamilleRoutes';


dotenv.config();

const app = express();
app.use(express.json());

app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/categories', CategorieRoutes);
app.use('/cultures', CultureRoutes);
app.use('/nomPersonnages', NomPersonnageRoutes);
app.use('/prenoms', NomPersonnageRoutes);
app.use('/nomFamilles', NomFamilleRoutes);
app.use('/fragmentsHistoire', FragmentsHistoireRoutes);
app.use('/titres', TitreRoutes);
app.use('/concepts', ConceptRoutes);
app.use('/lieux', LieuxRoutes);
app.use('/univers', UniversThematiqueRoutes);
app.use('/generate', GenerateRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Notre serveur est lance sur le port ${PORT}`);
});

