import {useState} from "react";
import {create} from "../../api/user-api";
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
import {Link} from "react-router-dom";


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

export default function SignUpForm() {
    const classes = useStyles()
    const [values, setValues] = useState({
        name: '',
        password: '',
        email: '',
        open: false,
        error: ''
    })

    const handleChange = (event) => {
        const {name, value} = event.target;
        setValues({...values, [name]: value});
    }

    const clickSubmit = () => {
        const user = {
            name: values.name || undefined,
            email: values.email || undefined,
            password: values.password || undefined
        }
        create(user).then((data) => {
            if (data.error) {
                setValues({...values, error: data.error})
            } else {
                setValues({...values, error: '', open: true})
            }
        })
    }
    return (
        <div>
            <Card className={classes.card}>
                <CardContent>
                    <Typography variant="h6" className={classes.title}>
                        Sign Up
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
                    {
                        values.error && (<Typography component="p" color="error">
                            <Icon color="error"
                                  className={classes.error}>error</Icon>
                            {values.error}</Typography>)
                    }
                </CardContent>
                <CardActions>
                    <Button color="primary" variant="contained"
                            onClick={clickSubmit}
                            className={classes.submit}>Submit</Button>
                </CardActions>
            </Card>
            <Dialog open={values.open} disableBackdropClick={true}>
                <DialogTitle>New Account</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        New account successfully created.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Link to="/signin">
                        <Button color="primary" autoFocus="autoFocus"
                                variant="contained">
                            Sign In
                        </Button>
                    </Link>
                </DialogActions>
            </Dialog>

        </div>
    )


}