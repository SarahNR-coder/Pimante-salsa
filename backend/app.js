const express = require('express');
const mongoose = require('mongoose');
//const path = require('path');

//const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://sarah:tAVt9fbHcWYEnZ5@cluster0.yqqrk.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true
})
.then(()=> console.log('Connexion à MongoDB réussie!'))
.catch(()=> console.log('Connexion à mongoDB échpouée!'));

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//app.use('/images', express.static(path.join(__dirname, 'images')));

//app.use('api/sauce', sauceRoutes);
//app.use('/api/auth', userRoutes);


module.exports =app;   