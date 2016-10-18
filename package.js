Package.describe({
  name: 'mdg:recurly',
  version: '0.0.1',
  summary: 'Synchronous Meteor wrapper for Recurly node client',
  documentation: 'README.md'
});

Npm.depends({
  'node-recurly': 'https://github.com/meteor/node-recurly/tarball/1ad6e08e49ace696d6ead785ce84d669f18d88ae'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.2');
  api.use([
    'ecmascript',
    'underscore'
  ]);
  api.addFiles([
    'recurly-client.js'
  ], 'server');
  api.export([
    'RecurlyClient',
    'NodeRecurly'
  ], 'server');
});
