/**Logique de métier de notre application concernant les utilisateurs */

/**Importation du package de cryptage bcrypt */
const bcrypt = require ('bcrypt');
/**Importation du package jsonwebtoken utilisé pour la création et la vérification de tokens */
const jwt = require('jsonwebtoken');
/**Importation du modèle de données Mongoose "User"*/
const User = require('../models/User');

/**Implémentation de l'inscription utilisateur:
 * Création d'un nouvel objet utilisateur : réception du mot de passe et hachage via la fonction bcrypt.hash avec un salage 10 fois, intégration du hash résultant dans le profil utilisateur, associé au mot de passe renseigné. Enregistrement de l'objet utilisateur.
 */
exports.signup =(req,res,next)=> {
    bcrypt.hash(req.body.password, 10)
    .then(hash=>{
        const user = new User({
            email: req.body.email,
            password: hash
        })
        user.save()
        .then(()=> res.status(201).json({message: 'Utilisateur créé !'}))
        .catch(error => res.status(400).json({error}))
    })
    .catch(error => res.status(500).json({error}));
}

/**Implémentation de la connexion utilisateur:
 * Récupération du mot de passe renseigné dans le formulaire de connexion sur le site (requête frontend POST). On voit si ça correspond à l'un de nos profil d'utilisateur. Si c'est le cas on compare, avec la fonction bcrypt.compare, le string que l'on génère avec le mot de passe entré par l'utilisateur et le hash généré à l'inscription de cet utilisateur, que nous avons en base de données. On voit ainsi s'ils ont la même origine, et que les deux mots de passe correspondent donc. Si c'est le cas on autorise l'accès à l'utilisateur et il se voit attribuer un token de connexion à durée limitée.
*/
exports.login = (req,res, next) => {
    User.findOne({email: req.body.email})
    .then(user => {
        if(!user){
            return res.status(401).json({error : 'Utilisateur non trouvé !'});
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if (!valid) {
                return res.status(401).json({error : 'Mot de passe incorrect !'});
            }
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    {userId: user._id},
                    'RANDOM_TOKEN_SECRET',
                    {expiresIn: '24h'}
                )
            });
        })
        .catch(error => res.status(500).json({error}))
    })
    .catch(error => res.status(500).json({error}));
};
/**à l'intérieur de jwt.sign() se trouve le payload, c'est à dire les données que l'on va encoder
 * Avec userId: user._id on s'assure que la requête corresponde à l'userID
 * RANDOM_TOKEN_SECRET est une clé secrète utilisée lors de l'encodage
 * expiresIn attribue une durée d'expiration au token
 */