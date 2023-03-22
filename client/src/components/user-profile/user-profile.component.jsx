import {useEffect, useState} from "react";
import {isAuthenticated} from "../../helper/auth.helper";
import {read} from "../../api/user-api";
import {Link, Navigate, useParams} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import {
    Avatar,
    Divider, IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    Paper
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {Edit, Person} from "@material-ui/icons";
import * as PropTypes from "prop-types";
import DeleteUser from "../user-delete/user-delete.component";

const defaultUser = {
    email: '',
    name: '',
    about:'',
    password: '',
}

const useStyles = makeStyles(theme => ({
    root: theme.mixins.gutters({
        maxWidth: 600,
        margin: 'auto',
        padding: theme.spacing(3),
        marginTop: theme.spacing(5)
    }),
    title: {
        marginTop: theme.spacing(3),
        color: theme.palette.protectedTitle
    }
}))



DeleteUser.propTypes = {userId: PropTypes.any};
const UserProfileComponent = ({match}) => {
    const classes = useStyles()
    const { userId } = useParams();
    const [user, setUser] = useState(defaultUser);
    const [redirectToSignin, setRedirectToSignin] = useState(false);
    const photoUrl = user._id
        ? `http://localhost:3100/api/users/photo/${user._id}?${new Date().getTime()}`
        : 'http://localhost:3100/api/users/defaultphoto'
    //alert(userId);
    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal
        const jwt = isAuthenticated()
        read({
            userId: userId
        }, {t: jwt.token}, signal).then((data) => {
            if (data && data.error) {
                setRedirectToSignin(true)
            } else {
                setUser(data)
            }
        })

        return function cleanup() {
           // abortController.abort()
        }
    }, [userId]);

    if (redirectToSignin) {
        return <Navigate to='/signin'/>
    }

    return (
        <Paper className={classes.root} elevation={4}>
            <Typography variant="h6" className={classes.title}>
                Profile
            </Typography>
            <List dense>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar crossOrigin="anonymous" src={photoUrl}>
                            <Person/>
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={user.name} secondary={user.email}/> {
                    isAuthenticated().user && isAuthenticated().user._id === user._id &&
                    (<ListItemSecondaryAction>
                        <Link to={"/user/edit/" + user._id}>
                            <IconButton aria-label="Edit" color="primary">
                                <Edit/>
                            </IconButton>
                        </Link>
                        <DeleteUser userId={user._id}/>
                    </ListItemSecondaryAction>)
                }
                </ListItem>
                <ListItem> <ListItemText primary={user.about}/> </ListItem>
                <Divider/>
                <ListItem>
                    <ListItemText primary={"Joined: " + (
                        new Date(user.created)).toDateString()}/>
                </ListItem>
            </List>
        </Paper>
    )
}

export default UserProfileComponent;