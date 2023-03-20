// In order to save the JWT credentials that are received from the server on successful
// sign-in, we use the authenticate method, which is defined as follows.
import {signout} from "../api/auth-api";

const authenticate = (jwt, cb) => {
    if (typeof window !== "undefined")
        sessionStorage.setItem('jwt', JSON.stringify(jwt))
    cb()
}

// In our frontend components, we will need to retrieve the stored credentials to check if
// the current user is signed in. In the isAuthenticated() method, we can retrieve
// these credentials from sessionStorage
const isAuthenticated = () => {
    if (typeof window == "undefined")
        return false
    if (sessionStorage.getItem('jwt'))
        return JSON.parse(sessionStorage.getItem('jwt'))
    else
        return false
}

// When a user successfully signs out from the application, we want to clear the stored
// JWT credentials from sessionStorage. This can be accomplished by calling the
// clearJWT method, which is defined in the following code
const clearJWT = (cb) => {
    if (typeof window !== "undefined")
        sessionStorage.removeItem('jwt')
    cb()
    signout().then((data) => {
        document.cookie = "t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    })
}

export {authenticate, isAuthenticated, clearJWT}