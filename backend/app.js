/**Fichier principal de notre application */

/**L'application se base sur le framework Express pour la pateforme Node.js qui permet d'écrire l'API
 * Elle utilise le package Mongoose qui facilite les interactions avec notre base de donnée MongoDB
 * path nous sert à définir un chemin de fichier
 */
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

/**Importation des routers correspondant aux différentes requêtes*/
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

/**Connexion à la base de données via Mongoose*/
mongoose.connect('mongodb+srv://sarah:tAVt9fbHcWYEnZ5@cluster0.yqqrk.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true
})
.then(()=> console.log('Connexion à MongoDB réussie!'))
.catch(()=> console.log('Connexion à mongoDB échpouée!'));

/**Notre application utilise le framework Express */
const app = express();

/**Gestion du Cross Origin Ressource Sharing (CORS) */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

/**On extrait le corps JSON des requêtes venant de l'application frontend */
app.use(express.json());

/**Notre application est dirigée vers le dossier statique images du backend pour incorporer les images issues des requêtes*/
app.use('/images', express.static(path.join(__dirname, 'images')));

/**Enregistrement des routers, qui géreront toutes les demandes effectuées vers /api/sauces et /api/auth */
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);


module.exports =app;   