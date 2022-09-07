/**************************************************************************
	* IMPORTS
	***************************************************************************/
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

/**************************************************************************
	* SCHEMA
	***************************************************************************/
const userSchema = mongoose.Schema({
  pseudo: { type: String, required: true },
  email: { type: String, required: true, unique: true }, 
  password: { type: String, required: true }, 
  isAdmin: { type: Boolean, default: false },
});

userSchema.plugin(uniqueValidator); // applique le validateur au schéma avant d'en faire un modèle

module.exports = mongoose.model('User', userSchema);