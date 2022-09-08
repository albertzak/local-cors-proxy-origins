#!/usr/bin/env node

var lcp = require('../lib/index.js');
var commandLineArgs = require('command-line-args');

var optionDefinitions = [
  { name: 'port', alias: 'p', type: Number, defaultValue: 8010 },
  { name: 'proxyUrl', type: String },
  { name: 'credentials', type: Boolean, defaultValue: false },
  { name: 'localOrigin', type: String },
  { name: 'remoteOrigin', type: String }
];

try {
  var options = commandLineArgs(optionDefinitions);
  if (!options.proxyUrl) {
    throw new Error('--proxyUrl is required');
  }
  lcp.startProxy(options.port, options.proxyUrl, options.credentials, options.remoteOrigin, options.localOrigin);
} catch (error) {
  console.error(error);
}
