const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();
 
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1]; // Récupère le token du header Authorization (en enlevant le mot "Bearer")
       const verifiedToken = jwt.verify(token, process.env.RANDOM_SECRET_TOKEN); // Vérifie le token
       req.auth = {
           userId: verifiedToken.userId // verifiedToken.userId = l'userId récupéré dans le token
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};
