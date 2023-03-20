/**
 * The auth controller functions in server/controllers/auth.controller.js will
 * not only handle requests to the signin and signout routes, but also provide JWT
 * and express-jwt functionality to enable authentication and authorization for
 * protected user API endpoints.
 */
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const config = require('./../config/config');

// The POST request object receives the email and password in req.body. This email is
// used to retrieve a matching user from the database. Then, the password
// authentication method defined in UserSchema is used to verify the password that's
// received in req.body from the client.
// If the password is successfully verified, the JWT module is used to generate a signed
// JWT using a secret key and the user's _id value
//
const signin = async (req, res) => {
    console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
    try {
        let user = await User.findOne({"email": req.body.email});
        if (!user)
            return res.status('401').json({error: "User not found"});
        if (!user.authenticate(req.body.password)) {
            return res.status('401').send({error: "Email and password don't match."});
        }

        // On the client-side, this token must be attached as an Authorization header when
        // requesting protected routes from the server.
        const token = jwt.sign({_id: user._id}, config.jwtSecret);

        // Optionally, we can also set the token to a cookie in the response object so that
        // it is available to the client-side if cookies are the chosen form of JWT storage.
        res.cookie('t', token, {expire: new Date() + 9999});
        return res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (err) {
        console.log(err);
        return res.status('401').json({error: "Could not sign in"})
    }
}

// The signout function clears the response cookie containing the signed JWT. This is
// an optional endpoint and not really necessary for auth purposes if cookies are not
// used at all in the frontend.
const signout = (req, res) => {
    res.clearCookie("t")
    return res.status('200').json({
        message: "signed out"
    })
}

const requireSignin = expressJwt.expressjwt({
    secret: config.jwtSecret,
    userProperty: 'auth',
    algorithms: ['sha1', 'RS256', 'HS256']
});


// The req.auth object is populated by express-jwt in requireSignin after
// authentication verification, while req.profile is populated by the userByID
// function in user.controller.js. We will add the hasAuthorization function to
// routes that require both authentication and authorization.
const hasAuthorization = (req, res, next) => {
    const authorized = req.profile && req.auth
        && req.profile._id == req.auth._id
    if (!(authorized)) {
        return res.status('403').json({
            error: "User is not authorized"
        })
    }
    next();
}

module.exports = {signin, signout, requireSignin, hasAuthorization}
