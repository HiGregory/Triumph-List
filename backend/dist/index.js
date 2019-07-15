'use strict';

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _userDataExt = require('./controller/extensions/userData-ext');

var _userDataExt2 = _interopRequireDefault(_userDataExt);

var _user = require('./model/user');

var _user2 = _interopRequireDefault(_user);

var _authMiddleware = require('./middleware/authMiddleware');

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

var LocalStrategy = require('passport-local').Strategy;
// var GoogleTokenStrategy =  require('passport-google-oauth20').Strategy;
// var FacebookTokenStrategy =  require('passport-facebook-token');


var app = (0, _express2.default)();
app.server = _http2.default.createServer(app);

//middleware
//parse application/json
app.use(_bodyParser2.default.json({
  limit: _config2.default.bodyLimit
}));

//local passport config
app.use(_passport2.default.initialize());
var Account = require('./model/account');
_passport2.default.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, Account.authenticate()));

_passport2.default.serializeUser(Account.serializeUser());
_passport2.default.deserializeUser(Account.deserializeUser());

//api routes v1
app.use('/v1', _routes2.default);

// Base URL test endpoint to see if API is running
app.get('/', function (req, res) {
  res.json({ message: 'Triumph API is ALIVE!' });
});

app.server.listen(_config2.default.port);
console.log('Started on port ' + app.server.address().port);

module.exports = {
  app: app
};
//# sourceMappingURL=index.js.map