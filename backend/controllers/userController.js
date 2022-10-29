/**************************************************************************
  * IMPORTS
  ***************************************************************************/
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');


/**************************************************************************
   * FUNCTIONS
   ***************************************************************************/

// SIGNUP (OK)

exports.signup = (req, res, next) => {
  // hashe le password envoyé dans le body (avec 10 cycles de salage)
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      // on créé un nouvel utilisateur
      const user = new User({ 
        pseudo: req.body.pseudo,
        email: req.body.email,
        password: hash, // le password qui vient d'être hashé
        isAdmin: false,
      });
      user.save() // on sauvegarde le nouvel utilisateur dans la BDD
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// LOGIN (OK)

exports.login = (req, res, next) => {
  // on cherche dans la BDD l'utilisateur qui correspond à l'email envoyé
  User.findOne({ email: req.body.email })
    .then(user => {
      // si l'utilisateur n'existe pas
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
       // si l'utilisateur existe, on compare le password envoyé avec le hash stocké
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          // si les deux correspondent, on crée un nouveau token
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id, isAdmin: user.isAdmin },
              process.env.RANDOM_SECRET_TOKEN, // chaîne secrète
              { expiresIn: '24h' } // le token est valide pendant 24 heures
            ),
            isAdmin: user.isAdmin,
            pseudo: user.pseudo
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};
