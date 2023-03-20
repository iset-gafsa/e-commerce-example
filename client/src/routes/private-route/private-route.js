/**
 * Components to be rendered in this PrivateRoute will only load when the user is
 * authenticated, which is determined by a call to the isAuthenticated method;
 * otherwise, the user will be redirected to the Signin component.
 */

import React, {Component} from 'react'
import {Route, Navigate, useLocation} from 'react-router-dom'
import {isAuthenticated} from '../../helper/auth.helper'

function RequireAuth({ children }) {
    let auth = isAuthenticated();
    let location = useLocation();

    if (!auth.user) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to={{
            pathname: '/signin',
            state: {from: location}
        }}/>;
    }
    console.log(typeof children)
    return (<children/>);
}

const PrivateRoute = ({children}) => {
    let auth = isAuthenticated();
    let location = useLocation();

    if (!auth.user) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to={{
            pathname: '/signin',
            state: {from: location}
        }}/>;
    }
    console.log(typeof children)
    return children;
}
export default PrivateRoute