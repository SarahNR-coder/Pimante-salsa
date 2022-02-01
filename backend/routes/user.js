/**Logique de routing de l'application concernant les utilisateurs*/

const express = require('express');
/** Déclaration de notre router des utilisateurs via la méthode express.Router() du framework Express*/
const router = express.Router();
/**Le fichier de contrôleur '../controllers/user' exporte des méthodes qui sont ensuite attribuées aux routes sauce ici */
const userCtrl = require('../controllers/user');

/**Configuration des différentes routes selon les requêtes front-end.
 * La requête d'inscription (nouvel utilisateur) et la requête de connexion : signup et login.
*/
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;