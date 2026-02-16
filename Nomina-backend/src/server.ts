import express from 'express';
import userRoutes from './routes/userRoutes'
import authRoutes from './routes/authRoutes'
import CategorieRoutes from './routes/CategorieRoutes';
import CultureRoutes from './routes/CultureRoutes';
import NomPersonnageRoutes from './routes/NomPersonnageRoutes';
import FragmentsHistoireRoutes from './routes/FragmentsHistoireRoutes';
import TitreRoutes from './routes/TitreRoutes';
import ConceptRoutes from './routes/ConceptRoutes';


const app = express();
app.use(express.json());

app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/categories', CategorieRoutes);
app.use('/cultures', CultureRoutes);
app.use('/nomPersonnages', NomPersonnageRoutes);
app.use('/fragmentsHistoire', FragmentsHistoireRoutes);
app.use('/titres', TitreRoutes);
app.use('/concepts', ConceptRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Notre serveur est lance sur le port ${PORT}`);
});

