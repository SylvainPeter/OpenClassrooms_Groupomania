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


// CREE UN NOUVEAU POST (ERREUR SI FILE!!!!)

exports.createPost = (req, res, next) => {
  const post = new Post({ // créé la nouvelle sauce
    ...req.body, // récupère toutes les infos du body
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // construit l'URL de l'image envoyée
  });

  post.save() // enregistre la sauce dans la BDD
    .then(() => { res.status(201).json({ message: 'Nouveau post publié !' }) })
    .catch(error => { res.status(400).json({ error }) })
};


// MOFIDIE UN POST (OK MAIS NE GERE PAS ENCORE ISADMIN)

exports.editPost = (req, res, next) => {
  const postObject = req.file ? { // vérifie si req.file existe ou non
      ...req.body, // récupère les nouvelles infos du body
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // construit l'URL de l'image envoyée
  } : { ...req.body };
  Post.findOne({ _id: req.params.id })
      .then((post) => { 
          if (post.userId != req.auth.userId) { // si l'utilisateur n'est pas autorisé
              res.status(401).json({ message: 'Pas autorisé à modifier !' });
          } else { // si l'utilisateur est autorisé
              Post.updateOne({ _id: req.params.id }, { ...postObject, _id: req.params.id }) // met à jour le Post ayant le même _id que le paramètre de la requête
                  .then(() => res.status(200).json({ message: 'Post modifié !' }))
                  .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};


// SUPPRIME UN POST (OK MAIS NE GERE PAS ENCORE ISADMIN)
exports.deletePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id }) // cherche dans la BDD la sauce ayant le même id que le paramètre de la requête
      .then(post => {
          if (post.userId != req.auth.userId) { // si l'utilisateur n'est pas autorisé
              res.status(401).json({ message: 'Pas autorisé à supprimer !' });
          } else { // si l'utilisateur est autorisé
              const filename = post.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => { // supprime l'image du dossier image
                Post.deleteOne({ _id: req.params.id }) // supprime la sauce de la BDD
                      .then(() => { res.status(200).json({ message: 'Post supprimé !' }) })
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch(error => {
          res.status(500).json({ error });
      });
};


// LIKE OU DISLIKE UN POST (OK)
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
