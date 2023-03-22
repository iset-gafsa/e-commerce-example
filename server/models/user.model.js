/**
 * User schema and model
 * The password field is very crucial for providing secure user authentication in any
 * application, and each user password needs to be encrypted, validated, and
 * authenticated securely as a part of the user model.
 *
 * The UserSchema methods can be used to provide the following functionality:
 *      - authenticate: This method is called to verify sign-in attempts by
 *        matching the user-provided password text with the hashed_password
 *        stored in the database for a specific user.
 *      - encryptPassword: This method is used to generate an encrypted hash
 *        from the plain-text password and a unique salt value using the crypto
 *        module from Node.
 *      - makeSalt: This method generates a unique and random salt value using
 *        the current timestamp at execution and Math.random().
 *@author : Walid HAMMAMI
 */

const mongoose = require('mongoose');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    email: {
        type: String,
        trim: true,
        unique: 'Email already exists',
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        required: 'Email is required'
    },
    //These Date values will be programmatically generated to record timestamps that
    // indicate when a user is created and user data is updated.
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date,
    //The hashed_password and salt fields represent the encrypted user password that
    // we will use for authentication.
    hashed_password: {
        type: String,
        required: "Password is required"
    },
    salt: String,
    about: {
        type: String,
        trim: true
    },
    photo: {
        data: Buffer,
        contentType: String
    }



});

/**
 * To add validation constraints to the actual password string that's selected by the end
 * user, we need to add custom validation logic and associate it with the
 * hashed_password field in the schema
 */
UserSchema.path('hashed_password').validate((v)=> {
    console.log("password ==== ",this._password);
    if (this._password && this.password.length < 6) {
        this.invalidate('password', 'Password must be at least 6 characters.')
    }
    if (this.isNew && !this._password) {
        this.invalidate('password', 'Password is required')
    }
}, null);

/**
 * The password string that's provided by the user is not stored directly in the user
 * document. Instead, it is handled as a virtual field.
 */

UserSchema
    .virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
        console.log('this.hashed_password = ',this.hashed_password);

    })
    .get(function() {
        return this._password
    });

/**
 * The encryption logic and salt generation logic, which are used to generate the
 * hashed_password and salt values representing the password value, are defined as
 * UserSchema methods.
 */
UserSchema.methods = {
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password
    },
    encryptPassword: function(password) {
        console.log('password = ',password);
        if (!password) return ''
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex')
        } catch (err) {
            console.log(err);
            return ''
        }
    },
    makeSalt: function() {
        return Math.round((new Date().valueOf() * Math.random())) + ''
    }
};



module.exports = mongoose.model('User', UserSchema)