import mongoose from 'mongoose';
import { Router } from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import config from '../config';
import Account from '../model/account';
import UserDataExt from './extensions/userData-ext';
import async from 'async';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';

import { generateAccessToken, respond, authenticate } from '../middleware/authMiddleware';

const TOKENTIME = 60*60*24*90;
const SECRET = "BadaGig SERVER SIDE";

var  nodeMailer = require('nodemailer');

export default ({ config, db }) => {
  let api = Router();

  // '/v1/account/register'
  api.post('/register', (req, res) => {
    UserDataExt.findUserByEmail(req.body.email, (err, userData) => {
      if (err) {
        res.status(409).json({ message: `An error occured: ${err.message}`});
        return;
      } else if (userData) {
        res.status(300).json({ message: `Email ${req.body.email} is already registered`});
      }
      // else {
        Account.register(new Account({username: req.body.email}), req.body.password, function(err, account) {
          if(err) {
            res.status(500).json({ message: err });
            return;
          }
          passport.authenticate('local', { session: false })(req, res, () => {
              res.status(200).send('Successfully created new account');
          });
        });
      // }
    });
  });
  //'/v1/account/activateaccount/:email' This is to activate a newly created account via email
  api.post('/activateaccount/:email', (req, res) => {
    UserDataExt.findUserByEmail(req.params.email, (err, user) => {
      if (err) {
        res.status(500).json({message: `An error has occured, please try again. ${err.message}`});
      } else if (!user) {
        res.status(404).json({message: "The specified email is not registered with us. Please proceed to create an account"});
      }
        user.isactivated = true;
        user.save(err => {
          if (err) {
              res.status(500).json({message: `An error has occured, please try again. ${err.message}`});
          }
            res.status(200).json(`You account have been successfully activiated. You can proceed to login`);
        })
    })
  })

  // '/v1/account/login'
  api.post('/login', (req, res, next) => {
		UserDataExt.findUserByEmail(req.body.email, (err, userData) => {
      if (err) {
        res.status(409).json({ message: `An error occured: ${err.message}`});
        return;
      } else {
				next();
			}
    });
	}, passport.authenticate('local', { session: false, scope: [] }), (err, req, res, next) => {
		if (err) {
			res.status(401).json({ message: `Password is incorrect`});
      return;
		}
	}, generateAccessToken, respond);

  return api;
}
