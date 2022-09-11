const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();
 
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1]; // Récupère le token du header Authorization (en enlevant le mot "Bearer")
       const decodedToken = jwt.verify(token, process.env.RANDOM_SECRET_TOKEN); // Vérifie le token
       const userId = decodedToken.userId; // extrait l'ID utilisateur du token et le rajoute à l’objet Request
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};
