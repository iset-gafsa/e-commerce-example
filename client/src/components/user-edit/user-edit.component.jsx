import {makeStyles} from "@material-ui/core/styles";
import {useEffect, useState} from "react";
import {create, read, update} from "../../api/user-api";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import {
    Button, CardActions, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Icon, TextField
} from "@material-ui/core";
import {Link, Navigate, useParams} from "react-router-dom";
import {isAuthenticated} from "../../helper/auth.helper";

const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 600, margin: 'auto', textAlign: 'center', marginTop: theme.spacing(5), paddingBottom: theme.spacing(2)
    }, error: {
        verticalAlign: 'middle'
    }, title: {
        marginTop: theme.spacing(2), color: theme.palette.openTitle
    }, textField: {
        marginLeft: theme.spacing(1), marginRight: theme.spacing(1), width: 300
    }, submit: {
        margin: 'auto', marginBottom: theme.spacing(2)
    }
}));

const UserEditComponent = () => {
    const classes = useStyles()
    const {userId} = useParams();
    const [redirectToProfile, setRedirectToProfile] = useState(false);
    const [values, setValues] = useState({
        name: '', password: '', email: '', error: '', redirectToProfile: false
    })
    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal
        const jwt = isAuthenticated()
        console.log(jwt)
        read({
            userId: userId
        }, {t: jwt.token}, signal).then((data) => {
            if (data && data.error) {
                setRedirectToProfile(true)
            } else {
                console.log(data)
                setValues({...values, ...data})
            }
        })
    }, [])
    const handleChange = (event) => {
        const {name, value} = event.target;
        setValues({...values, [name]: value});
    }
    const clickSubmit = () => {
        const jwt = isAuthenticated()
        const user = {
            name: values.name || undefined, email: values.email || undefined, password: values.password || undefined
        }
        update({userId}, {t: jwt.token}, user).then((data) => {
            if (data.error) {
                setValues({...values, open: true, error: data.error})
            } else {
                setValues({
                    ...values, userId: data._id, redirectToProfile:
                        true
                })

            }
        })
    }


    if (values.redirectToProfile) {
        return (<Navigate to={`/users/${userId}`}/>)
    }
    return (<div>
        <Card className={classes.card}>
            <CardContent>
                <Typography variant="h6" className={classes.title}>
                    Edit Profile
                </Typography>
                <TextField id="name" label="Name"
                           className={classes.textField}
                           name='name'
                           value={values.name} onChange={handleChange}
                           margin="normal"/>
                <br/>
                <TextField id="email" type="email" label="Email"
                           className={classes.textField}
                           name='email'
                           value={values.email} onChange={handleChange}
                           margin="normal"/>
                <br/>
                <TextField id="password" type="password" label="Password"
                           className={classes.textField} value={values.password}
                           name='password'
                           onChange={handleChange} margin="normal"/>
                <br/>
                {values.error && (<Typography component="p" color="error">
                    <Icon color="error"
                          className={classes.error}>error</Icon>
                    {values.error}</Typography>)}
            </CardContent>
            <CardActions>
                <Button color="primary" variant="contained"
                        onClick={clickSubmit}
                        className={classes.submit}>Submit</Button>
            </CardActions>
        </Card>

    </div>)

}

export default UserEditComponent