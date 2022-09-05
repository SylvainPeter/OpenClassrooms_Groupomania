/**************************************************************************
  * IMPORTS
  ***************************************************************************/
const jwt = require('jsonwebtoken');
// const dotenv = require("dotenv");
// dotenv.config();

const User = require('../models/user.model');
const Post = require('../models/post.model');
const fs = require('fs');


/**************************************************************************
  * FUNCTIONS
  ***************************************************************************/

// RECUPERE TOUS LES POSTS

exports.getAllPosts = (req, res, next) => {
  Post.find().then( // cherche dans la BDD tous les posts
    //  const sort = { _id: -1}
    // Post.find().sort(sort).then(
    (posts) => {
      res.status(200).json(posts); // renvoie la liste des posts au format JSON
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

// RECUPERE UN POST SPECIFIQUE

exports.getOnePost = (req, res, next) => {
  Post.findOne({ // cherche dans la BDD le Post ayant le même id que le paramètre de la requête
    _id: req.params.id
  }).then(
    (post) => {
      res.status(200).json(post); // renvoie ce post au format JSON
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

// ENVOIE UN NOUVEAU POST

exports.createPost = (req, res, next) => {
  const postObject = { ...req.body }; // récupère toutes les infos du body
  const post = new Post({ // créé le nouveau post
    ...postObject, // opérateur spread pour faire une copie rapide de tous les éléments de postObject
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // construit l'URL de l'image envoyée
  });
  post.save() // enregistre le post dans la BDD
    .then(() => res.status(201).json({ message: 'Nouveau post publié !' }))
    .catch(error => res.status(400).json({ error }));
};

// MOFIDIE UN POST

exports.editPost = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1]; // récupère le token
  const decodedToken = jwt.verify(token, process.env.RANDOM_SECRET_TOKEN); // vérifie le token
  Post.findOne({ _id: req.params.id }).then((data) => {
    User.findOne({
      _id: decodedToken.userId
    }).then((dataUser) => {
      if (data.userId == decodedToken.userId || dataUser.isAdmin == true) { //compare l'userId du post avec l'userId du token
        const postObject = req.file ?
          {
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
          } : { ...req.body };
          Post.updateOne({ _id: req.params.id }, { ...postObject, _id: req.params.id }) // met à jour le post ayant le même _id que le paramètre de la requête
          .then(() => res.status(200).json({ message: 'Post mis à jour !' }))
          .catch(error => res.status(400).json({ error }));
      }
      else { // si l'utilisateur n'est pas autorisé à modifier
        res.status(401).json({ message: "Pas autorisé à modifier !" })
      }
    }).catch(error => res.status(400).json({ error }));
  })
};


// SUPPRIME UN POST

exports.deletePost = (req, res, next) => {
  // recuperer le token dans la chaine de string (enlever le mot bearer et l'espace)
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.RANDOM_SECRET_TOKEN);
  Post.findOne({ _id: req.params.id }).then((data) => { // cherche dans la BDD le post ayant le même id que le paramètre de la requête
    User.findOne({
      _id: decodedToken.userId
    }).then((dataUser) => {
      if (data.userId == decodedToken.userId || dataUser.isAdmin == true) { // si l'utilisateur est autorisé
        Post.findOne({ _id: req.params.id })
          .then(post => {
            const filename = post.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => { // supprime l'image du dossier image
              Post.deleteOne({ _id: req.params.id }) // supprime le post de la BDD
                .then(() => res.status(200).json({ message: 'Post supprimé !' }))
                .catch(error => res.status(400).json({ error }));
            });
          })
          .catch(error => res.status(500).json({ error }));
      } else { // si l'utilisateur n'est pas autorisé
        res.status(401).json({ message: "Pas autorisé à supprimer !" })
      }
    }).catch(error => res.status(400).json({ error }));
  })
};


// LIKE

exports.likePost = (req, res, next) => {
  Post.updateOne( // mise à jour du post
    { _id: req.params.id },
    {
      $inc: { likes: 1 },
      $push: { usersLiked: req.body.userId }
    }
  )
    .then(() => res.status(200).json({ message: `Like ajouté` }))
    .catch((error) => res.status(400).json({ error }))
}
