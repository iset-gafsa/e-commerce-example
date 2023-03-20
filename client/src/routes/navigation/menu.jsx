import {AppBar, Button, IconButton, Toolbar} from "@material-ui/core";

import Typography from "@material-ui/core/Typography";
import {Link, Navigate} from "react-router-dom";
import HomeIcon from '@material-ui/icons/Home'

import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {clearJWT, isAuthenticated} from "../../helper/auth.helper";
import {Outlet} from "react-router";
import {Fragment, useState} from "react";

function withRouter(Component) {
    function ComponentWithRouterProp(props) {
        let location = useLocation();
        let navigate = useNavigate();
        let params = useParams();
        return (
            <Component
                {...props}
                location={location}
                params={params}
                navigate={navigate}
            />
        );
    }

    return ComponentWithRouterProp;
}

const isActive = (location, path) => {
    if (location.pathname == path)
        return {color: '#ff4081'}
    else
        return {color: '#ffffff'}
}
const MenuComponent = withRouter(({location, params, navigate}) => {
        const [signOut, setSignOut] = useState(false)

        return (
            <Fragment>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" color="inherit">
                            MERN Skeleton
                        </Typography>
                        <Link to="/">
                            <IconButton aria-label="Home" style={isActive(location, "/")}>
                                <HomeIcon/>
                            </IconButton>
                        </Link>
                        <Link to="/users">
                            <Button style={isActive(location, "/users")}>Users</Button>
                        </Link>
                        {
                            !isAuthenticated() && (<span>
          <Link to="/signup">
            <Button style={isActive(location, "/signup")}>Sign up
            </Button>
          </Link>
          <Link to="/signin">
            <Button style={isActive(location, "/signin")}>Sign In
            </Button>
          </Link>
        </span>)
                        }
                        {
                            isAuthenticated() && (<span>
          <Link to={"/users/" + isAuthenticated().user._id}>
            <Button style={isActive(location, "/user/" + isAuthenticated().user._id)}>My Profile</Button>
          </Link>
          <Button color="inherit" onClick={() => {
              clearJWT(() => console.log("sign out"));
              setSignOut(true);
          }}>Sign out</Button>
        </span>)
                        }
                    </Toolbar>
                </AppBar>
                <Outlet></Outlet>
            </Fragment>
        )
    }
)

export default MenuComponent