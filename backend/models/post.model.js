/**************************************************************************
	* IMPORTS
	***************************************************************************/
const mongoose = require('mongoose');

/**************************************************************************
	* SCHEMA
	***************************************************************************/
const postSchema = mongoose.Schema({
  userId: { type: String, required: true },
  pseudo: { type: String }, // A SUPPRIMER ?
  text: { type: String, trim: true, maxlenght: 1000 },
  imageUrl: { type: String },
  likes: { type: Number, default: 0 },
  usersLiked: { type: Array }
});

module.exports = mongoose.model('Post', postSchema);