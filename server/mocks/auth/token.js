const util = require('util');

module.exports = function(app) {
  var express = require('express');
  var bodyParser = require('body-parser');
  var jwt = require('jsonwebtoken');
  var apiTokenAuthRouter = express.Router();

  apiTokenAuthRouter.post('/', function(req, res) {
    console.log('body is: ' + util.inspect(req.body));
    jwt.sign(req.body, 'secret', { expiresIn: 10 }, function(token) {
      res.send({
        token: token
      });
    });
  });

  app.use(bodyParser.json());
  app.use('/api/auth/token', apiTokenAuthRouter);
};
