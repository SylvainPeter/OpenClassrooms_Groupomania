/**************************************************************************
	* IMPORTS
	***************************************************************************/
  const express = require('express'); 
  const mongoose = require('mongoose');
  const path = require('path');
  const helmet = require('helmet');
  // const bodyParser = require("body-parser");
  const app = express();
  
  const userRoutes = require('./routes/user.routes');
  const postRoutes = require('./routes/post.routes')
  // const commentsRoutes = require('./routes/comment.routes.js');
  
  require('dotenv').config(); // Variables d'environnement
  
  
  /**************************************************************************
    * DATABASE CONNEXION
    ***************************************************************************/
  mongoose.connect(process.env.MONGODB_ACCESS,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));
  
  
  /**************************************************************************
    * SECURITY
    ***************************************************************************/
  
  // Sécurise les headers HTTP
  app.use(helmet());
  
  // Autorise le CORS
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
  
  // Autorise le chargement d'images depuis la BDD
  app.use(function (req, res, next) {
    res.setHeader('Cross-Origin-Resource-Policy', 'same-site')
    next()
  })
  
  /**************************************************************************
    * APP SETTINGS
    ***************************************************************************/
  
  // Bodyparser
  app.use(express.json());
  // app.use(bodyParser.urlencoded({ extended: false })); 
  // app.use(bodyParser.json());
  
  // Routers
  app.use('/api/auth', userRoutes); // Routes pour l'authentification
  app.use('/api/post', postRoutes); // Routes pour les posts
  // app.use('/api/comment', commentsRoutes); // Route pour les commentaires ?
  
  app.use('/images', express.static(path.join(__dirname, 'images'))); // Routes pour les images statiques
  
  
  module.exports = app;
  