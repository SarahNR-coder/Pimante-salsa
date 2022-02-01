/**Logique de métier de notre application concernant les sauces */

/**Importation du modèle de données Mongoose "Sauce"*/
const Sauce = require('../models/Sauce');
/**Importation du package file-system qui donne accès à différentes opérations sur le système de fichier*/
const fs = require('fs');

/**Une fonctionnalité Create dans notre application qui se rapporte à l'action CRUD 
 * Création d'une sauce
 * On crée un objet sauce, on définit l'url de l'image, on initialise les paramètres en rapport aux likes à zéro, et on enregistre le tout.
*/
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [""],
        usersDisliked: [""]
    });
    sauce.save()
    .then(()=>res.status(201).json({message:'Objet enregistré !'}))
    .catch(error => res.status(400).json({error}));
}

/**Mise en place des statuts like des utilisateurs pour une sauce donnée
 * Le statut like qui est définit à 1 dans la requête pour un utilisateur signifie que l'utilisateur a cliqué sur l'icône pouce levé(like) pour définir son statut à "like" pour cette sauce.
 * Statut like à 0 : l'utilisateur a cliqué sur l'icône pouce levé(like) pour annuler son statut "like", ou bien a cliqué sur l'icône pouce baissé(dislike) pour annuler son statut "dislike". Ce qui fait qui n'a plus aucun statut d'appréciation (statut like) définit pour cet sauce; like: 0.
 * Statut like à -1: l'utilisateur a cliqué sur l'icône pouce baissé(dislike) pour définir son statut à "dislike" pour cette sauce.
 * Cette expression prend en compte ces trois scénarios possibles et applique les actions appropriées sur le nombre de likes et de dislikes de la sauce,le tableau renseignant les utilisateurs qui "like" cette sauce, et le tableau de ceux qui la "dislike".
 */
exports.setLikeStatus = (req, res, next)=> {
    const currentUserLikeStatus = req.body.like;
    const currentUserID = req.body.userId;
    console.log('ligne 23')
    Sauce.findOne({_id: req.params.id})
    .then(sauce =>{
        console.log('je suis dans findOneAndUpdate de setLikeStatus');
        const usersLikedThisSauce = sauce.usersLiked;
        const usersDislikedThisSauce = sauce.usersDisliked;
        switch (currentUserLikeStatus) {
            case 1:
                console.log("je passe dans 1");
                if (!usersLikedThisSauce.includes(currentUserID)) {
                    sauce.likes++;
                    usersLikedThisSauce.push(currentUserID);
                    if (usersDislikedThisSauce.includes(currentUserID)) {
                        usersDislikedThisSauce.splice(usersDislikedThisSauce.indexOf(currentUserID), 1);
                        sauce.dislikes--;
                    }
                }
                break;
            case 0:
                if (usersLikedThisSauce.includes(currentUserID)) {
                    sauce.likes--;
                    usersLikedThisSauce.splice(usersLikedThisSauce.indexOf(currentUserID), 1);
                } else {
                    if (usersDislikedThisSauce.includes(currentUserID)) {
                        sauce.dislikes--;
                        usersDislikedThisSauce.splice(usersDislikedThisSauce.indexOf(currentUserID), 1);
                    }
                }
                break;
            case -1:
                if (!usersDislikedThisSauce.includes(currentUserID)) {
                    sauce.dislikes++;
                    usersDislikedThisSauce.push(currentUserID);
                    if (usersLikedThisSauce.includes(currentUserID)) {
                        usersLikedThisSauce.splice(usersLikedThisSauce.indexOf(currentUserID), 1);
                        sauce.likes--;
                    }
                }
                break;
            default: 
                console.log('Pas de modification du statut like');
                break;
        }
        sauce.save();
    })
    .then(()=> res.status(200).json({message : 'Statut like renseigné!'}))
    .catch(error => res.status(500).json({error}));
}

/**Une fonctionnalité Update dans notre application qui se rapporte à l'action CRUD 
 * Modification de la sauce, avec ou sans chargement d'une nouvelle image
*/
exports.modifySauce = (req, res, next) => {
    const  sauceObject =  req.file ? 
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};
    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
    .then(()=> res.status(200).json({message :'Objet modifié !'}))
    .catch(error => res.status(400).json({error}));
}

/**Une fonctionnalité Delete dans notre application qui se rapporte à l'action CRUD 
 * Suppression d'une sauce et suppression du fichier image s'y rapportant
*/
exports.deleteSauce = (req,res,next)=> {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () =>{
            Sauce.deleteOne({_id : req.params.id })
            .then(()=> res.status(200).json({message :'Objet supprimé !'}))
            .catch(error => res.status(400).json({error}));
        })
    })
    .catch(error => res.status(500).json({error}));
};

/**Une fonctionnalité Read dans notre application qui se rapporte à l'action CRUD 
 * Récupération d'une sauce
*/
exports.getOneSauce = (req, res, next)=>{
    Sauce.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({error}));
}

/**Une fonctionnalité Read dans notre application qui se rapporte à l'action CRUD 
 * Récupération de toutes les sauces
*/
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
};


