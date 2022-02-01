/**Logique de routing de l'application concernant les sauces*/

const express = require('express');
/** Déclaration de notre router des sauces via la méthode express.Router() du framework Express*/
const router = express.Router();
/**Le fichier de contrôleur '../controllers/sauce' exporte des méthodes qui sont ensuite attribuées aux routes sauce ici */
const sauceCtrl = require('../controllers/sauce');
/**Importation du middleware d'authentification qui va implémenter l'authentification sur l'application */
const auth = require ('../middleware/auth');
/**Le middleware Express multer nous sert à télécharger des fichiers */
const multer = require('../middleware/multer-config');

/**Configuration des différentes routes selon les requêtes front-end. Toutes les requêtes auront besoin d'une authentification et certaines, celles qui gèrent des fichiers, utiliseront un multer. */
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.post('/:id/like', auth, sauceCtrl.setLikeStatus);
router.delete('/:id',auth, sauceCtrl.deleteSauce);
router.get('/:id',auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getAllSauces);

module.exports = router;