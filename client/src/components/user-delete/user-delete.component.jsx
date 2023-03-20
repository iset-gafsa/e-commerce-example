import {Fragment, useState} from "react";
import {clearJWT, isAuthenticated} from "../../helper/auth.helper";
import {remove} from "../../api/user-api";
import {Navigate} from "react-router-dom";
import DeleteIcon from '@material-ui/icons/Delete'

import {
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton
} from "@material-ui/core";

export default function DeleteUser(props) {
    const [open, setOpen] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const clickButton = () => {
        setOpen(true);
    }

    const handleRequestClose = () => {
        setOpen(false);
    }

    const deleteAccount = () => {
        const jwt = isAuthenticated()
        remove({
            userId: props.userId
        }, {t: jwt.token}).then((data) => {
            if (data && data.error) {
                console.log(data.error)
            } else {
                clearJWT(() => console.log('deleted'))
                setRedirect(true)
            }
        });
    }

    if (redirect) {
        return <Navigate to='/'/>
    }

    return (<Fragment>
        <IconButton aria-label="Delete"
                    onClick={clickButton} color="secondary">
            <DeleteIcon/>
        </IconButton>
        <Dialog open={open} onClose={handleRequestClose}>
            <DialogTitle>{"Delete Account"}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Confirm to delete your account. {props.userId}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleRequestClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={deleteAccount}
                        color="secondary" autoFocus="autoFocus">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    </Fragment>)


}