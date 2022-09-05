/**************************************************************************
    * IMPORTS
    ***************************************************************************/
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');
const postCtrl = require('../controllers/post.controller');

/**************************************************************************
    * ROUTES
    ***************************************************************************/

router.get('/', auth, postCtrl.getAllPosts); // Récupère tous les post
router.get('/:id', auth, postCtrl.getOnePost); // Récupére un post avec son identitifiant
router.post('/', auth, multer, postCtrl.createPost); // Envoie un nouveau post
router.post('/:id/like', auth, postCtrl.likePost); // Définit le statut like pour un post
router.put('/:id', auth, multer, postCtrl.editPost); // Met à jour un post
router.delete('/:id', auth, postCtrl.deletePost); // Supprime un post


module.exports = router;
