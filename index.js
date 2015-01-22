'use strict';

// See https://github.com/jshint/jshint/issues/1747 for context
/* global -Promise */
var Promise = require('es6-Promise').Promise;

module.exports = findApp;

function findApp(options) {
  
  options = options || {};

  var client = options.client;
  var manifest = options.manifest;

  return new Promise(function(resolve, reject) {

    if (client === undefined || manifest === undefined) {
      return reject(new Error('We need a client and a manifest to find an app'));
    }

    getWebAppsActor(client)
      .then(listInstalledApps)
      .then(filterAppsByName(manifest.name))
      .then(function(result) {
        resolve(result);
      });

  });

}


function getWebAppsActor(client) {
  return new Promise(function(resolve, reject) {

    client.getWebapps(function(err, webapps) {
      if (err) {
        return reject(err);
      }

      resolve(webapps);

    });

  });
}


function listInstalledApps(webAppsActor) {
  return new Promise(function(resolve, reject) {

    webAppsActor.getInstalledApps(function(err, apps) {

      if (err) {
        return reject(err);
      }

      resolve(apps);

    });

  });
}


function filterAppsByName(name) {

  return function(apps) {
    return new Promise(function(resolve) {
      resolve(apps.filter(function(app) {
        return app.name === name;
      }));
    });
  };

}
