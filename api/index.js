const auth = require('./auth');
const users = require('./users');
const sessions = require('./sessions');
const events = require('./events');
const bodyParser = require('body-parser');
const middleware = require('./middleware');
const twilio = require('./twilio');

// Mount API routes on the Express web app
module.exports = function(app) {

    // Login Routes
  app.post('/authenticate', auth.login);

  // Logout routes
  app.post('/logout/:user', middleware.loginRequired, auth.logout)

  // Create a new user
  app.post('/user', users.create);

  // Create Event
  app.post('/events', events.create);

  // Get Events
  app.get('/events/all', events.getAll);

  // Get information about the currently logged in user
  app.get('/user', middleware.loginRequired, users.getUser);

  // routes message to users
  app.get('/message', twilio.sendSMS);

};
