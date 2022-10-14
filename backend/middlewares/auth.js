const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();



module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // récupère le token du header Authorization (en enlevant le mot "Bearer")
        const verifiedToken = jwt.verify(token, process.env.RANDOM_SECRET_TOKEN); // vérifie le token
        req.auth = {
            userId: verifiedToken.userId, // le userId récupéré dans le token
            isAdmin: verifiedToken.isAdmin // le isAdmin récupéré dans le token
        }
        next();
    } catch (error) {
        res.status(401).json({ error });
    }
};
