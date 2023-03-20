/**
 * The auth routes are as follows:
 * '/auth/signin': POST request to authenticate the user with their email
 * and password
 * '/auth/signout': GET request to clear the cookie containing a JWT that
 * was set on the response object after sign-in
 */

const express = require('express');
const authCtrl = require('../controllers/auth.controller');
const router = express.Router()

router.route('/signin')
    .post(authCtrl.signin);

router.route('/signout')
    .get(authCtrl.signout);

module.exports= router;
