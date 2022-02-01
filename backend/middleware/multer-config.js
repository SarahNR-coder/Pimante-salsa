/**On configure le multer pour pouvoir charger des fichiers lors de nos requêtes */
const multer = require('multer');

/**Dictionnaire des extensions*/
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png' : 'png'
}

/**Implémentation de l'enregistrement du fichier sur le disque:
 * On configure le chemin ainsi que le nom de fichier pour les fichiers attachés à une requête entrante
 * destination correspond à là où le multer va retourner les fichiers : quand la requête réussit (callback null) les fichiers sont envoyés au dossier 'images' du backend
 * Filename : le nom du fichier est changé pour avoir un fichier unique par requête. On formate le nom du fichier: les espaces, pouvant être causes de dysfonctions, sont remplacés par des underscores.
 * On applique au fichier l'extension qui correspond à son mimetype.
 * On ajoute un time stamp (référence au moment de téléchargement du fichier) pour rendre le nom du fichier encore plus unique. Mesure prise à l'échelle de la milliseconde.
 */
const storage = multer.diskStorage({
    destination: (req, file, callback) =>{callback(null, 'images')},
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

/**Il s'agit d'un fichier unique : on spécifie single; et d'un fichier image */
module.exports = multer({storage}).single('image'); 
