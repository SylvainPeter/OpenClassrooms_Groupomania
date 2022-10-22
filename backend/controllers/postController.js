/**************************************************************************
  * IMPORTS
  ***************************************************************************/
const Post = require('../models/postModel');
const fs = require('fs');
const dotenv = require("dotenv");
dotenv.config();

/**************************************************************************
  * FUNCTIONS
  ***************************************************************************/

// RECUPERE TOUS LES POSTS

exports.getAllPosts = (req, res, next) => {
  // cherche tous les posts dans la BDD et les trie du plus récent au plus ancien
  Post.find().sort({ _id: -1 }).then(
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


// RECUPERE UN POST SPECIFIQUE

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


// CREE UN NOUVEAU POST

exports.createPost = (req, res, next) => {
  const post = new Post({ // créé le nouveau post
    ...req.body, // récupère toutes les infos du body
    userId: req.auth.userId,
    // construit l'URL de l'image envoyée (accepte les images vides)
    imageUrl: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : ''
  });
  // enregistre le post dans la BDD
  post.save()
    .then(() => { res.status(201).json({ message: 'Nouveau post publié !' }) })
    .catch(error => { res.status(400).json({ error }) })
};


// MOFIDIE UN POST

exports.editPost = (req, res, next) => {

  let postObject = '';

  // si req.file existe (l'utilisateur a posté une nouvelle image)
  if (req.file) {
    postObject = {
      ...req.body, // on récupère les nouvelles infos du body
      // on construit l'URL de la nouvelle image envoyée
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }
    // on cherche le Post dans la base de données
    Post.findOne({ _id: req.params.id })
      .then((post) => {
        // si l'utilisateur est authentifié ou s'il est admin
        if (post.userId == req.auth.userId || req.auth.isAdmin == true) {
          // on efface l'ancienne image
          const filename = post.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
            // on met à jour le Post ayant le même _id que le paramètre de la requête
            Post.updateOne({ _id: req.params.id }, { ...postObject, _id: req.params.id })
              .then(() => res.status(200).json({ message: 'Post modifié, nouvelle image ajoutée !' }))
              .catch(error => res.status(401).json({ error }));
          });
        } else { // si l'utilisateur n'est pas autorisé
          res.status(401).json({ message: 'Pas autorisé à modifier !' });
        }
      }) // en cas d'erreur
      .catch((error) => {
        res.status(400).json({ error });
      });
  }

  // si req.file n'existe pas (pas de nouvelle image) et que l'utilisateur a effacé l'ancienne image
  else if (!req.file && req.body.image == 'deleted') {
    postObject = { ...req.body, imageUrl: '' };
    // on cherche le Post dans la base de données
    Post.findOne({ _id: req.params.id })
      .then((post) => {
        // si l'utilisateur est authentifié ou s'il est admin
        if (post.userId == req.auth.userId || req.auth.isAdmin == true) {
          // on efface l'ancienne image
          const filename = post.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
            // on met à jour le Post ayant le même _id que le paramètre de la requête
            Post.updateOne({ _id: req.params.id }, { ...postObject, _id: req.params.id })
              .then(() => res.status(200).json({ message: 'Post modifié, ancienne image supprimée !' }))
              .catch(error => res.status(401).json({ error }));
          });
        } else { // si l'utilisateur n'est pas autorisé
          res.status(401).json({ message: 'Pas autorisé à modifier !' });
        }
      }) // en cas d'erreur
      .catch((error) => {
        res.status(400).json({ error });
      });
  }

  // si req.file n'existe pas (pas de nouvelle image) et que l'utilisateur n'a pas effacé l'ancienne image
  else if (!req.file) {
    postObject = { ...req.body };
    // on cherche le Post dans la base de données
    Post.findOne({ _id: req.params.id })
      .then((post) => {
        // si l'utilisateur est authentifié ou s'il est admin
        if (post.userId == req.auth.userId || req.auth.isAdmin == true) {
          // on met à jour le Post ayant le même _id que le paramètre de la requête
          Post.updateOne({ _id: req.params.id }, { ...postObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Post modifié !' }))
            .catch(error => res.status(401).json({ error }));
        } else { // si l'utilisateur n'est pas autorisé
          res.status(401).json({ message: 'Pas autorisé à modifier !' });
        }
      })
      .catch((error) => {
        res.status(400).json({ error });
      });
  }

};


// SUPPRIME UN POST
exports.deletePost = (req, res, next) => {
  // on cherche dans la BDD le post ayant le même id que le paramètre de la requête
  Post.findOne({ _id: req.params.id })
    .then(post => {
      // si l'utilisateur est authentifié ou s'il est admin
      if (post.userId == req.auth.userId || req.auth.isAdmin == true) {
        const filename = post.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => { // supprime l'image du dossier image
          Post.deleteOne({ _id: req.params.id }) // supprime le post de la BDD
            .then(() => { res.status(200).json({ message: 'Post supprimé !' }) })
            .catch(error => res.status(401).json({ error }));
        });
      } else { // si l'utilisateur n'est pas autorisé
        res.status(401).json({ message: 'Pas autorisé à supprimer !' });
      }
    })
    .catch(error => {
      res.status(500).json({ error });
    });
};


// LIKE OU DISLIKE UN POST
exports.likePost = (req, res, next) => {
  // si l'utilisateur like le post (1)
  if (req.body.like === 1) {
    Post.updateOne( // mise à jour du post
      { _id: req.params.id },
      {
        $inc: { likes: 1 }, // incrémente le champ likes
        $push: { usersLiked: req.auth.userId }, // ajoute l'id de cet utilisateur au tableau usersLiked
      }
    )
      .then(() => res.status(200).json({ message: "Like ajouté !" }))
      .catch((error) => res.status(400).json({ error }));
  }

  // si l'utilisateur dislike le post (-1)
  else if (req.body.like === -1) {
    Post.updateOne( // mise à jour du post
      { _id: req.params.id },
      {
        $inc: { dislikes: 1 }, // incrémente le champ dislikes
        $push: { usersDisliked: req.auth.userId }, // ajoute l'id de cet utilisateur au tableau usersDisliked
      }
    )
      .then(() => res.status(200).json({ message: "Dislike ajouté !" }))
      .catch((error) => res.status(400).json({ error }));
  }

  // si l'utilisateur annule son like ou son dislike (0)
  else if (req.body.like === 0) {
    Post.findOne({ _id: req.params.id })
      .then((post) => {
        // si l'id de l'utilisateur est déjà présent dans usersLiked
        if (post.usersLiked.includes(req.auth.userId)) {
          Post.updateOne( // mise à jour du post
            { _id: req.params.id },
            {
              $pull: { usersLiked: req.auth.userId }, // retire l'id de cet utilisateur du tableau usersLiked
              $inc: { likes: -1 } // décrémente le champ likes
            }
          )
            .then(() => {
              res.status(200).json({ message: "Like supprimé !" });
            })
            .catch((error) => res.status(400).json({ error }));
        }
        // si l'id de l'utilisateur est déjà présent dans usersDisliked
        else if (post.usersDisliked.includes(req.auth.userId)) {
          Post.updateOne( // mise à jour du post
            { _id: req.params.id },
            {
              $pull: { usersDisliked: req.auth.userId }, // retire l'id de cet utilisateur du tableau usersDisliked
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
