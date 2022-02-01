/**On crée un schéma de données avec Mongoose */

const mongoose = require ('mongoose');
/**Importation du package de validation servant à prévalider les informations avant enregistrement */
const uniqueValidator = require('mongoose-unique-validator');

/**schéma de l'utilisateur: toutes les propriétés qui doivent s'appliquer à notre utilisateur
 * La clé unique sert à s'assurer que deux utilisateurs n'utilisent pas la même adresse email */
const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {type: String, required: true}
})

/**l'élément 'mongoose-unique-validator' est passé en plug-in et crée une seconde assurance contre l'utilisation d'une même adresse email par plusieurs utilisateurs*/
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);