import dotenv from 'dotenv';
import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';

dotenv.config();

import UserDataExt from './controller/extensions/userData-ext';
import User from './model/user';
import { generateAccessToken, respond, authenticate } from './middleware/authMiddleware'

const LocalStrategy  = require('passport-local').Strategy;
// var GoogleTokenStrategy =  require('passport-google-oauth20').Strategy;
// var FacebookTokenStrategy =  require('passport-facebook-token');


import config from './config';
import routes from './routes';

let app = express();
app.server = http.createServer(app);

//middleware
//parse application/json
app.use(bodyParser.json({
  limit: config.bodyLimit
}));

//local passport config
app.use(passport.initialize());
let Account = require('./model/account');
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
  Account.authenticate()
));


passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

//api routes v1
app.use('/v1', routes);

// Base URL test endpoint to see if API is running
app.get('/', (req, res) => {
  res.json({ message: 'Triumph API is ALIVE!' })
});

app.server.listen(config.port);
console.log(`Started on port ${app.server.address().port}`);

module.exports = {
  app
}
