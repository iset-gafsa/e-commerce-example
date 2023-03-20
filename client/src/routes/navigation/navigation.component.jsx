import {Outlet} from "react-router";
import {Fragment, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {isAuthenticated} from "../../helper/auth.helper";

const NavigationComponent = () => {
    const [user,setUser] = useState({});
    useEffect(()=>{
        const user = isAuthenticated().user;
        //console.table(user);
        setUser(user);
    },[]);
    console.log('render' +user)
    return (

        <Fragment>

            <ul>
                <li><Link to='/'>Home</Link></li>
                <li><Link to='/users'>Users</Link></li>
                {
                    isAuthenticated().user  && (
                        <li><Link to={`/users/${isAuthenticated().user._id}`}>My Profile</Link></li>
                    )
                }

                {
                    !isAuthenticated().user  && (
                        <li><Link to='/signin'>Sign In</Link></li>
                    )
                }

                <li><Link to='/signup'>Sign Up</Link></li>
            </ul>
            <Outlet></Outlet>
        </Fragment>
    )
}

export default NavigationComponent;