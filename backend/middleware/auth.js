/**Middleware permettent d'implémenter l'authentification sur les requêtes */

/**Importation du package jsonwebtoken utilisé pour la création et la vérification de tokens */
const jwt = require('jsonwebtoken');

/**On va extraire le token du header 'Authorization' de la requête
 * On le décode en utilisant la clé secrète et on retrouve le userId correspondant
 * On ouvre l'accès à l'utilisateur si l'userId est valide
 */
module.exports= (req, res, next) =>{
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        req.auth = {userId: userId};
        if(req.body.userId && req.body.userId!= userId){
           throw 'User ID non valable';
        }else{
            next(); 
        }
    }catch(error){
        res.status(401).json({error: error | 'Requête non authentifiée' });
    }
};


/**Pour chaque requête sur une route protégée on passe d'abord par ce middleware ici*/