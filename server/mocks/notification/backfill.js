module.exports = function(app) {
  var express = require('express');
  var apiBackfillRouter = express.Router();

  // POST /backfill
  apiBackfillRouter.post('/', function(req, res) {
    var payload = {
      meta: {
        message: "I'll get to it shortly!"
      }
    }
    res.send(payload);
  });

  app.use('/api/notification/backfill', apiBackfillRouter);
};
