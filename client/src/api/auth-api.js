
// The signin method will take user sign-in data from the view component, then use
// fetch to make a POST call to verify the user with the backend
const signin = async (user) => {
    try {
        let response = await fetch('http://localhost:3100/auth/signin/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
           // credentials: 'include',
            body: JSON.stringify(user)
        })
        return await response.json()
    } catch(err) {
        console.log(err)
    }
}

// The signin method will take user sign-in data from the view component, then use
// fetch to make a POST call to verify the user with the backend
const signout = async () => {
    try {
        let response = await fetch('http://localhost:3100/auth/signout/', { method: 'GET' })
        return await response.json()
    } catch(err) {
        console.log(err)
    }
}

export { signin, signout }

