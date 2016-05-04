module.exports = function(app) {
  var express = require('express');
  var apiNotificationRouter = express.Router();

  // GET /threads
  apiNotificationRouter.get('/', function(req, res) {
    var payload = {
      data: [
        {
          type: "threads",
          id: 1111111,
          attributes: {
            thread_url: "http://example.com/fakethread/1111111",
            thread_subscription_url: "http://example.com/fakethread/subscribe/1111111",
            reason: "subscribed",
            updated_at: 1462543600,
            subject_title: "Subject Pull Request #1",
            subject_url: "http://example.com/fakethread/subscribe/1111111",
            subject_type: "Issue",
            repository_owner: "octocat",
            repository_name: "right-pad",
            tags: [
              "octocat",
              "right-pad",
              "amazing",
              "work"
            ]
          }
        },
        {
          type: "threads",
          id: 1111112,
          attributes: {
            thread_url: "http://example.com/fakethread/1111112",
            thread_subscription_url: "http://example.com/fakethread/subscribe/1111112",
            reason: "subscribed",
            updated_at: 1462543600,
            subject_title: "Subject Pull Request #2",
            subject_url: "http://example.com/fakethread/subscribe/1111112",
            subject_type: "Issue",
            repository_owner: "octocat",
            repository_name: "right-pad",
            tags: [
              "octocat",
              "right-pad",
              "amazing",
              "work"
            ]
          }
        }
      ]
    };
    res.send(payload);
  });

  // GET /threads/1234
  apiNotificationRouter.get('/:threadId', function(req, res) {
    var payload = {
      data: {
        type: "threads",
        id: req.params.threadId,
        attributes: {
          thread_url: "http://example.com/fakethread/" + req.params.threadId,
          thread_subscription_url: "http://example.com/fakethread/subscribe/" + req.params.threadId,
          reason: "subscribed",
          updated_at: 1462543600,
          subject_title: "Subject Pull Request #2",
          subject_url: "http://example.com/fakethread/subscribe/" + req.params.threadId,
          subject_type: "Issue",
          repository_owner: "octocat",
          repository_name: "right-pad",
          tags: [
            "octocat",
            "right-pad",
            "amazing",
            "work"
          ]
        }
      }
    }
    res.send(payload);
  });

  // PATCH /threads/1234
  apiNotificationRouter.patch('/:threadId', function(req, res) {
    var payload = {
      meta: {
        message: "Thread ${req.params.threadId} updated successfully"
      }
    }
    res.send(payload);
  });

  // DELETE /threads/1234
  apiNotificationRouter.delete('/:threadId', function(req, res) {
    var payload = {
      meta: {
        message: "Thread ${req.params.threadId} successfully deleted"
      }
    }
    res.send(payload);
  });

  app.use('/api/notification/threads', apiNotificationRouter);
};
