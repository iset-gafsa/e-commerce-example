import {useEffect, useState} from "react";
import {list} from "../../api/user-api";
import {
    Avatar,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    Paper
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {Link} from "react-router-dom";
import {ArrowForward, Person} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    root: theme.mixins.gutters({
        padding: theme.spacing(1),
        margin: theme.spacing(5)
    }),
    title: {
        margin: `${theme.spacing(4)}px 0 ${theme.spacing(2)}px`,
        color: theme.palette.openTitle
    }
}))

const UserListComponent = () => {
    const [users, setUsers] = useState([]);
    const classes = useStyles()
    useEffect(() => {
        // The AbortController interface represents a controller object
        // that allows you to abort one or more Web requests as and when desired.
        const abortController = new AbortController()
        const signal = abortController.signal
        list(signal).then((data) => {
            if (data && data.error) {
                console.log(data.error)
            } else {
                setUsers(data)
            }
        })

        console.log('finish load');
        // In this effect, we also add a cleanup function to abort the fetch call when the
        // component unmounts.
        return function cleanup() {
            console.log('clean up');
            //abortController.abort()
        }
        // In the second argument of this useEffect hook, we pass an empty array so that this
        // effect cleanup runs only once upon mounting and unmounting, and not after every
        // render.
    }, []);


    return (
        <Paper className={classes.root} elevation={4}>
            <Typography variant="h6" className={classes.title}>
                All Users
            </Typography>
            <List dense>
                {users.map((item, i) => {
                    return <Link to={"/users/" + item._id} key={i}>
                        <ListItem button>
                            <ListItemAvatar>
                                <Avatar>
                                    <Person/>
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={item.name}/>
                            <ListItemSecondaryAction>
                                <IconButton>
                                    <ArrowForward/>
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </Link>
                })
                }
            </List>
        </Paper>
    )

}

export default UserListComponent;