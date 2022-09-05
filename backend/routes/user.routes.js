/**************************************************************************
	* IMPORTS
	***************************************************************************/
    const express = require('express');
    const router = express.Router();
    const rateLimit = require('../middlewares/rate-limit');
    const password = require('../middlewares/password-validator');
    const userCtrl = require('../controllers/user.controller');
    
    /**************************************************************************
        * ROUTES
        ***************************************************************************/
    router.post('/signup', rateLimit, password, userCtrl.signup);
    router.post('/login', rateLimit, password, userCtrl.login);
    /*
    router.get('/me', auth, userCtrl.getUserProfile);
    router.put('/update',auth, userCtrl.modifyProfile);
    router.delete('/delete', auth, userCtrl.deleteProfile)
    */
    
    module.exports = router;