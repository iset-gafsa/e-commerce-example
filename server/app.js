var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var cors = require('cors');
var bodyParser = require('body-parser')

require('./models/db-connection')
const helmet = require("helmet");

var app = express();

app.use(bodyParser.urlencoded({ extended: true }))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// secure apps by setting various HTTP headers
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// enable CORS - Cross Origin Resource Sharing
const corsOption={
    origin:'true'
}
app.use(cors());

app.use('/api', indexRouter);

app.use('/auth', authRouter);

// To handle auth-related errors thrown by express-jwt when it tries to validate JWT
// tokens in incoming requests
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({"error" : err.name + ": " + err.message})
    }else if (err) {
        res.status(400).json({"error" : err.name + ": " + err.message})
        console.log(err)
    }
})


module.exports = app;
