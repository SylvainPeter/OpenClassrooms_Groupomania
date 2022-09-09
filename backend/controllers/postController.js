/**************************************************************************
  * IMPORTS
  ***************************************************************************/
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Post = require('../models/postModel');
const fs = require('fs');
const dotenv = require("dotenv");
dotenv.config();

/**************************************************************************
  * FUNCTIONS
  ***************************************************************************/

// RECUPERE TOUS LES POSTS (OK)

exports.getAllPosts = (req, res, next) => {
  Post.find().sort({ _id: -1 }).then( // cherche tous les posts dans la BDD et les trie du plus récent au plus ancien
    (posts) => {
      res.status(200).json(posts); // renvoie tous les posts au format JSON
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

// RECUPERE UN POST SPECIFIQUE (OK)

exports.getOnePost = (req, res, next) => {
  Post.findOne({ // cherche dans la BDD le post ayant le même id que le paramètre de la requête
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

// ENVOIE UN NOUVEAU POST (ERREUR SI FILE!!!!)

exports.createPost = (req, res, next) => {
  const postObject = { ...req.body }; // récupère toutes les infos du body
  const post = new Post({ // créé un nouveau post
    ...postObject, // opérateur spread pour faire une copie rapide de tous les éléments de postObject
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // construit l'URL de l'image envoyée
  });
  post.save() // enregistre le nouveau post dans la BDD
    .then(() => res.status(201).json({ message: 'Nouveau post publié !' }))
    .catch(error => res.status(400).json({ error }));
};

// MOFIDIE UN POST (OK)
exports.editPost = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1]; // récupère le token
  const verifiedToken = jwt.verify(token, process.env.RANDOM_SECRET_TOKEN); // vérifie le token
  Post.findOne({ _id: req.params.id }).then((postData) => {
    User.findOne({
      _id: verifiedToken.userId
    }).then((userData) => {
      if (postData.userId == verifiedToken.userId || userData.isAdmin == true) { // si l'utilisateur est authentifié ou s'il est admin
        const postObject = req.file ? // vérifie si req.file existe ou non
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

// LIKE OU DISLIKE UNE SAUCE (OK)
exports.likePost = (req, res, next) => {
  if (req.body.like === 1) { // si l'utilisateur like la sauce (1)
    Post.updateOne( // mise à jour de la sauce
      { _id: req.params.id },
      {
        $inc: { likes: 1 }, // incrémente le champ likes
        $push: { usersLiked: req.body.userId }, // ajoute l'id de cet utilisateur au tableau usersLiked
      }
    )
      .then(() => res.status(200).json({ message: "Like ajouté !" }))
      .catch((error) => res.status(400).json({ error }));
  }

  else if (req.body.like === -1) { // si l'utilisateur dislike la sauce (-1)
    Post.updateOne( // mise à jour de la sauce
      { _id: req.params.id },
      {
        $inc: { dislikes: 1 }, // incrémente le champ dislikes
        $push: { usersDisliked: req.body.userId }, // ajoute l'id de cet utilisateur au tableau usersDisliked
      }
    )
      .then(() => res.status(200).json({ message: "Dislike ajouté !" }))
      .catch((error) => res.status(400).json({ error }));
  }

  else if (req.body.like === 0) { // si l'utilisateur annule son like ou son dislike (0)
    Post.findOne({ _id: req.params.id })
      .then((post) => {
        if (post.usersLiked.includes(req.body.userId)) { // si l'id de l'utilisateur est déjà présent dans usersLiked
          Post.updateOne( // mise à jour de la sauce
            { _id: req.params.id },
            {
              $pull: { usersLiked: req.body.userId }, // retire l'id de cet utilisateur du tableau usersLiked
              $inc: { likes: -1 } // décrémente le champ likes
            }
          )
            .then(() => {
              res.status(200).json({ message: "Like supprimé !" });
            })
            .catch((error) => res.status(400).json({ error }));
        }
        else if (post.usersDisliked.includes(req.body.userId)) { // si l'id de l'utilisateur est déjà présent dans usersDisliked
          Post.updateOne( // mise à jour de la sauce
            { _id: req.params.id },
            {
              $pull: { usersDisliked: req.body.userId }, // retire l'id de cet utilisateur du tableau usersDisliked
              $inc: { dislikes: -1 }, // décrémente le champ dislikes
            }
          )
            .then(() => {
              res.status(200).json({ message: "Dislike supprimé !" });
            })
            .catch((error) => res.status(400).json({ error }));
        }
      })
      .catch((error) => res.status(400).json({ error }));
  }
};



// SUPPRIME UNE SAUCE (MANQUE LE UNLINK)

exports.deletePost = (req, res) => {
  const id = req.params.id;
  Post.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Impossible de trouver le Post id=${id}`
        });
      } else {
        res.send({
          message: "Post supprimé !"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Impossible de supprimer le Post id=" + id
      });
    });
};

