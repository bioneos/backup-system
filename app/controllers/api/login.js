const express = require('express'),
  router = express.Router(),
  argon = require('argon2');
const db = require('../../models').getDatabase();

const logger = require('../../../lib/config/log4js').getLogger();

/**
 * Service login requests by matching a username and password to the Database.
 */
router.post('/login', (req, res, next) => {
  db.User.findOne({
    where: {
      username : req.body.username
    }
  }).then (user => {
    // Keep error messages vague to avoid releasing too much information
    if (!user)
    {
      logger.warn('Request for unknown user: "' + req.body.username + '"');
      return res.status(401).send({ error: "Wrong username or password"});
    }

    argon.verify(user.password, req.body.password).then( match => {
      if (!match)
      {
        logger.warn('Incorrect password attempted for user: "' + req.body.username + '"');
        return res.status(401).send({ error: "Wrong username or password"});
      }
      else
      {
        // In the future we might want to set distinguished roles in this value:
        req.session.authorized = 'user';
        res.status(200).send({});
      }
    }).catch (err => {
      logger.error('Argon2 problem with .verify() for user password');
      logger.debug(err);
      return res.status(500).send({
        error: "There was an internal problem, please contact support..."
      });
    });
  }).catch (err => {
    logger.error('Database or Sequelize error getting user');
    logger.debug(err);
    return res.status(500).send({
      error: "There was an internal problem, please contact support..."
    });
  });
});

module.exports = (app => {
  app.use('/api', router);
});
