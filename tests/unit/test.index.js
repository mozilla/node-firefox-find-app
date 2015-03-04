'use strict';

var findApp = require('../../index');

module.exports = {

  setUp: function(done) {
    this.mockClient = buildMockClientWithWebapps([
      { id: 'abcdef0', name: 'node-firefox-install-app' },
      { id: '8675309', name: 'hello-world' }
    ]);
    done();
  },

  'findApp() should yield an error when missing client option': function(test) {
    findApp({
      manifest: { name: 'foo' }
    }).then(function(results) {
      test.ok(false);
      test.done();
    }).catch(function(err) {
      test.done();
    });
  },

  'findApp() should yield an error when missing manifest option': function(test) {
    findApp({
      client: this.mockClient
    }).then(function(results) {
      test.ok(false);
      test.done();
    }).catch(function(err) {
      test.done();
    });
  },

  'findApp() should fetch apps and filter by name': function(test) {
    var expectedName = 'node-firefox-install-app';
    findApp({
      client: this.mockClient,
      manifest: { name: expectedName }
    }).then(function(results) {
      test.equal(1, results.length);
      test.equal(expectedName, results[0].name);
      test.done();
    }).catch(function(err) {
      test.ifError(err);
      test.done();
    });
  }

};

// Build just enough of a mock client to yield web apps for findApp()
function buildMockClientWithWebapps(apps) {
  return {
    getWebapps: function(webappsCallback) {
      webappsCallback(null, {
        getInstalledApps: function(installedAppsCallback) {
          installedAppsCallback(null, apps);
        }
      });
    }
  };
}
