const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const dotenv = require("dotenv");
dotenv.config();



module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // récupère le token du header Authorization (en enlevant le mot "Bearer")
        const verifiedToken = jwt.verify(token, process.env.RANDOM_SECRET_TOKEN); // vérifie le token
        req.auth = {
            userId: verifiedToken.userId // verifiedToken.userId = l'userId récupéré dans le token
        };
        User.findOne({
            _id: verifiedToken.userId // retrouve l'utilisateur à partir de l'Id
        }).then((userData) => {
            req.isAdmin = userData.isAdmin; // récupère le statut admin de l'utilisateur
       
        }).catch(error => res.status(400).json({ error }));
        next();
    } catch (error) {
        res.status(401).json({ error });
    }
};
