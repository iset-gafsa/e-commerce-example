const create = async (user) => {
    try {
        let response = await fetch('http://localhost:3100/api/users/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        return await response.json()
    } catch (err) {
        console.log(err)
    }
}

// The list method will use fetch to make a GET call to retrieve all the users in the
// database, and then return the response from the server as a promise to the
// component.
const list = async (signal) => {
    try {
        let response = await fetch('http://localhost:3100/api/users/', {
            method: 'GET',
            signal: signal,
        })
        const data =  await response.json();
        return data;
    } catch(err) {
        console.log(err)
    }
}

// The read method will use fetch to make a GET call to retrieve a specific user by ID.
// Since this is a protected route, besides passing the user ID as a parameter, the
// requesting component must also provide valid credentials, which, in this case, will be
// a valid JWT received after a successful sign-in.
const read = async (params, credentials, signal) => {
    try {
        let response = await fetch('http://localhost:3100/api/users/' + params.userId, {
            method: 'GET',
            signal: signal,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            }
        })
        return await response.json()
    } catch(err) {
        console.log(err)
    }
}

/*The update method will take changed user data from the view component for a
    specific user, then use fetch to make a PUT call to update the existing user in the
backend. This is also a protected route that will require a valid JWT as the credential.
    mern-skeleton/client/user/api-user.js:*/
const update = async (params, credentials, user) => {
    try {
        let response = await fetch('http://localhost:3100/api/users/' + params.userId, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            },
            body: JSON.stringify(user)
        })
        return await response.json()
    } catch(err) {
        console.log(err)
    }
}

// The remove method will allow the view component to delete a specific user from the
// database and use fetch to make a DELETE call. This, again, is a protected route that
// will require a valid JWT as a credential, similar to the read and update methods.
const remove = async (params, credentials) => {
    try {
        let response = await fetch('http://localhost:3100/api/users/' + params.userId, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            }
        })
        return await response.json()
    } catch(err) {
        console.log(err)
    }
}

export { create, list, read, update, remove }
