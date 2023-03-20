import {useState} from "react";
import {signin} from "../../api/auth-api";
import {authenticate} from "../../helper/auth.helper";
import {Link, Navigate} from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import {
    Button,
    CardActions,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Icon,
    TextField
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const defaultFormFields={
    email:'',
    password:'',
    error: '',
    redirectToReferrer: false
}


const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 600,
        margin: 'auto',
        textAlign: 'center',
        marginTop: theme.spacing(5),
        paddingBottom: theme.spacing(2)
    },
    error: {
        verticalAlign: 'middle'
    },
    title: {
        marginTop: theme.spacing(2),
        color: theme.palette.openTitle
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 300
    },
    submit: {
        margin: 'auto',
        marginBottom: theme.spacing(2)
    }
}))

const SignInFormComponent = (props)=> {
    const classes = useStyles()
    const [formFields, setFormFields] = useState(defaultFormFields);

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormFields({...formFields, [name]: value});
    }
    const clickSubmit = () => {
        const user = {
            email: formFields.email || undefined,
            password: formFields.password || undefined
        }
        signin(user).then((data) => {
            console.log(data);
            if (data.error) {
                setFormFields({...formFields, error: data.error})
            } else {
                authenticate(data, () => {
                    setFormFields({...formFields, error: '', redirectToReferrer: true})
                })
            }
        })
    }


    const {from} = props.location.state || {
        from: {
            pathname: '/'
        }
    }
    const {redirectToReferrer} = formFields
    if (redirectToReferrer) {
        return (<Navigate to={from}/>)
    }

    return (
        <div>
            <Card className={classes.card}>
                <CardContent>
                    <Typography variant="h6" className={classes.title}>
                        Sign In
                    </Typography>

                    <TextField id="email" type="email" label="Email"
                               className={classes.textField}
                               name='email'
                               value={formFields.email} onChange={handleChange}
                               margin="normal"/>
                    <br/>
                    <TextField id="password" type="password" label="Password"
                               className={classes.textField} value={formFields.password}
                               name='password'
                               onChange={handleChange} margin="normal"/>
                    <br/>
                    {
                        formFields.error && (<Typography component="p" color="error">
                            <Icon color="error"
                                  className={classes.error}>error</Icon>
                            {formFields.error}</Typography>)
                    }
                </CardContent>
                <CardActions>
                    <Button color="primary" variant="contained"
                            onClick={clickSubmit}
                            className={classes.submit}>Submit</Button>
                </CardActions>
            </Card>

        </div>
    )
}
export default SignInFormComponent;