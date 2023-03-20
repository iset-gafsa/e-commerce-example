const User = require('../models/user.model');
//lodash is a JavaScript library that provides utility functions for
// common programming tasks, including the manipulation of arrays
// and objects. To install lodash, run yarn add lodash from the
// command line.
const extend = require('lodash/extend');
const errorHandler = require('../helper/dbErrorHandler');

// This function creates a new user with the user JSON object that's received in the POST
// request from the frontend within req.body. The call to user.save attempts to save
// the new user in the database after Mongoose has performed a validation check on the
// data. Consequently, an error or success response is returned to the requesting client.
const create = async (req, res) => {
    const user = new User(req.body)
    try {

        await user.save();
        return res.status(200).json({
            message: "Successfully signed up!"
        })
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
};

// The list controller function finds all the users from the database, populates only the
// name, email, created, and updated fields in the resulting user list, and then returns
// this list of users as JSON objects in an array to the requesting client.
const list = async (req, res) => {
    try {
        let users = await User.find().select('name email updated created')
        res.json(users)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

// Whenever the Express app receives a request to a route that matches a path
// containing the :userId parameter in it, the app will execute the userByID controller
// function, which fetches and loads the user into the Express request object, before
// propagating it to the next function that's specific to the request that came in.
const userByID = async (req, res, next, id) => {
    try {
        let user = await User.findById(id)
        if (!user)
            return res.status('400').json({
                error: "User not found"
            })
        req.profile = user
        next()
    } catch (err) {
        return res.status('400').json({
            error: "Could not retrieve user"
        })
    }
};

// The read function retrieves the user details from req.profile and removes
// sensitive information, such as the hashed_password and salt values, before
// sending the user object in the response to the requesting client.
const read = (req, res) => {
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    return res.json(req.profile)
}

// The update function retrieves the user details from req.profile and then uses the
// lodash module to extend and merge the changes that came in the request body to
// update the user data. Before saving this updated user to the database, the updated
// field is populated with the current date to reflect the last updated timestamp. Upon
// successfully saving this update, the updated user object is cleaned by removing
// sensitive data, such as <b>hashed_password</b> and salt, before sending the user object in
// the response to the requesting client.
const update = async (req, res) => {
    try {
        let user = req.profile
        user = extend(user, req.body)
        user.updated = Date.now()
        await user.save()
        user.hashed_password = undefined
        user.salt = undefined
        res.json(user)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }

}

// The remove function retrieves the user from req.profile and uses the remove()
// query to delete the user from the database. On successful deletion, the requesting
// client is returned the deleted user object in the response.
const remove = async (req, res) => {
    try {
        let user = req.profile
        let deletedUser = await user.remove()
        deletedUser.hashed_password = undefined
        deletedUser.salt = undefined
        res.json(deletedUser)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}


module.exports = {
    create,
    list,
    read,
    update,
    remove,
    userByID
}