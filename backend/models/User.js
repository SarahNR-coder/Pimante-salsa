const mongoose = requre ('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {type: String, required: true}
})

userSchema.plugin(uniqueValidator);

module.eports = mongoose.model('User', userSchema);