/**************************************************************************
  * IMPORTS
  ***************************************************************************/
 const bcrypt = require('bcrypt');
 const jwt = require('jsonwebtoken');
 const User = require('../models/user.model');
 

 /**************************************************************************
    * FUNCTIONS
    ***************************************************************************/
 
// Signup
 
exports.signup = (req, res, next) => {
 //  const emailCryptoJs = cryptojs.HmacSHA256(req.body.email, process.env.CRYPTOJS_EMAIL_KEY).toString();   // On chiffre l'email avant de l'envoyer dans la base de données
  bcrypt.hash(req.body.password, 10) // hashe le mot de passe récupéré dans le body (avec 10 cycles de salage)
    .then(hash => { // on récupère le hash
      const user = new User({ // on créé un nouvel User
        pseudo: req.body.pseudo,
        email: req.body.email,
        password: hash, // le mot de passe crypté
        isAdmin: false,
      });
      user.save() // on sauvegarde le nouvel User dans la BDD
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// Login

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password) // Compare le mot de passe entré avec le hash stocké dans la BDD
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign( // Chiffre un nouveau token
              { userId: user._id },
              process.env.RANDOM_SECRET_TOKEN, // chaîne secrète
              { expiresIn: '24h' } // définit la durée de validité du token à 24 heures
            ),
            isAdmin: user.isAdmin,
            pseudo: user.pseudo,
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};
