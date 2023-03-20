/**
 * - /users for the following:
 *      Listing users with GET
 *      Creating a new user with POST
 * - /users/:userId for the following:
 *      Fetching a user with GET
 *      Updating a user with PUT
 *      Deleting a user with DELETE
 */

var express = require('express');
var router = express.Router();
const userCtrl = require('../controllers/user.controller');
const authCtrl = require('../controllers/auth.controller');


router.route('/users')
    .get(userCtrl.list)
    .post(userCtrl.create);

// The route to read a user's information only needs authentication verification, whereas
// the update and delete routes should check for both authentication and authorization
// before these CRUD operations are executed.
router.route('/users/:userId')
    .get(authCtrl.requireSignin,
        userCtrl.read) //execute requiredSigin before read user
    .put(authCtrl.requireSignin,
        authCtrl.hasAuthorization,
        userCtrl.update) //user must sign in and has authorization to update
    .delete(authCtrl.requireSignin,
        authCtrl.hasAuthorization,
        userCtrl.remove);

/**
 * Besides declaring API endpoints that correspond to user CRUD operations, we'll also
 * configure the Express router so that it handles the userId parameter in a requested
 * route by executing the userByID controller function
 */
router.param('userId', userCtrl.userByID);

module.exports = router;
