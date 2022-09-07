/**************************************************************************
	* IMPORTS
	***************************************************************************/
    const express = require('express');
    const router = express.Router();
    const rateLimit = require('../middlewares/rate-limit');
    const password = require('../middlewares/password-validator');
    const userCtrl = require('../controllers/userController');
    
/**************************************************************************
    * ROUTES
    ***************************************************************************/
    router.post('/signup', rateLimit, password, userCtrl.signup);
    router.post('/login', rateLimit, password, userCtrl.login);

    
    module.exports = router;