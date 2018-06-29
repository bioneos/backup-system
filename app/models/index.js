'use strict';
const fs = require('fs'),
  path = require('path'),
  Sequelize = require('sequelize');

const DB_URL = 'sqlite://localhost/backup-system';
let db = {};

/**
 * Module pattern.
 */
module.exports = {
  init: (config) => {
    // First ensure data directory, or throw exception
    try 
    {
      fs.accessSync(config.data_dir);
    }
    catch (error)
    {
      throw new Error('Cannot access the data directory, or it does not exist (' + config.data_dir + ')');
    }

    // Read our model definitions and associate relationships
    let sequelize = new Sequelize(DB_URL, {
      storage: path.join(config.data_dir, "events.db"),
      operatorsAliases: false,
      logging: false
    });
    fs.readdirSync(__dirname).filter((file) => {
      return (file.indexOf('.') !== 0) && (file !== 'index.js');
    }).forEach((file) => {
      let model = sequelize['import'](path.join(__dirname, file));
      db[model.name] = model;
    });
    Object.keys(db).forEach((modelName) => {
      if ('associate' in db[modelName]) {
        db[modelName].associate(db);
      }
    });

    // Instance reference
    db.sequelize = sequelize;
    // Class reference
    db.Sequelize = Sequelize;

    return db;
  },
  getDatabase: () => {
    // NOTE: This method should never be called before the init method.
    // If this error occurs during runtime, reorganize your code to ensure
    // the database is initialized before this method is used.
    if (!db.sequelize)
      throw new Error("Database has not been initialized!");
    return db;
  }
};
