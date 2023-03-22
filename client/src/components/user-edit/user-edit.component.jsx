import {makeStyles} from "@material-ui/core/styles";
import {useEffect, useState} from "react";
import {create, read, update} from "../../api/user-api";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import {
    Avatar,
    Button, CardActions, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Icon, TextField,

} from "@material-ui/core";
import FileUpload from '@material-ui/icons/AddPhotoAlternate'

import {Link, Navigate, useParams} from "react-router-dom";
import {isAuthenticated} from "../../helper/auth.helper";


const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 600,
        margin: 'auto',
        textAlign: 'center',
        marginTop: theme.spacing(5),
        paddingBottom: theme.spacing(2)
    },
    title: {
        margin: theme.spacing(2),
        color: theme.palette.protectedTitle
    },
    error: {
        verticalAlign: 'middle'
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 300
    },
    submit: {
        margin: 'auto',
        marginBottom: theme.spacing(2)
    },
    bigAvatar: {
        width: 60,
        height: 60,
        margin: 'auto'
    },
    input: {
        display: 'none'
    },
    filename:{
        marginLeft:'10px'
    }
}))

const UserEditComponent = () => {
    const classes = useStyles()
    const {userId} = useParams();
    const [redirectToProfile, setRedirectToProfile] = useState(false);
    const [values, setValues] = useState({
        name: '', password: '', email: '', error: '', about: '', redirectToProfile: false
    })
    const photoUrl = userId
        ? `http://localhost:3100/api/users/photo/${userId}?${new Date().getTime()}`
        : 'http://localhost:3100/api/users/defaultphoto'
    console.log(photoUrl)
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
        let {name, value} = event.target;

        value = (name === 'photo' )? event.target.files[0]: value;
        if(name==='photo'){
            console.log(value);
        }

        setValues({...values, [name]: value});
    }
    const clickSubmit = () => {
        let userData = new FormData()
        values.name && userData.append('name', values.name)
        values.email && userData.append('email', values.email)
        values.password && userData.append('password', values.password)
        values.about && userData.append('about', values.about)
        values.photo && userData.append('photo', values.photo)

        console.log("****",userData);
        const jwt = isAuthenticated();

        /*const user = {
            name: values.name || undefined, email: values.email || undefined, password: values.password || undefined,
            about: values.about || undefined
        }*/
        update({userId}, {t: jwt.token}, userData).then((data) => {
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
    //alert(values.photo)
    return (<div>
        <Card className={classes.card}>
            <CardContent>
                <Typography variant="h6" className={classes.title}>
                    Edit Profile
                </Typography>
                <Avatar src={photoUrl} className={classes.bigAvatar}/><br/>
                <input accept="image/*" name='photo' onChange={handleChange} className={classes.input} id="icon-button-file" type="file" />
                <label htmlFor="icon-button-file">
                    <Button variant="contained" color="default" component="span">
                        Upload
                        <FileUpload/>
                    </Button>
                </label> <span className={classes.filename}>{values.photo ? values.photo.name : ''}</span><br/>
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
                <TextField
                    id="multiline-flexible"
                    className={classes.textField}
                    label="About"
                    name='about'
                    multiline
                    minRows="2"
                    value={values.about}
                    onChange={handleChange}
                />
                <br/>


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