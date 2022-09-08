var express = require('express');
var request = require('request');
var cors = require('cors');
var chalk = require('chalk');
var proxy = express();

var startProxy = function(port, proxyUrl, credentials, remoteOrigin, localOrigin) {
  proxy.use(cors({credentials: credentials, origin: localOrigin}));
  proxy.options('*', cors({credentials: credentials, origin: localOrigin || true}));

  // remove trailing slash
  var cleanProxyUrl = proxyUrl.replace(/\/$/, '');

  proxy.use('/', function(req, res) {
    try {
      console.log(chalk.green('Request Proxied -> ' + req.url));
    } catch (e) {}

    if (remoteOrigin) {
      req.headers.origin = remoteOrigin
    }

    req.pipe(
      request(cleanProxyUrl + req.url)
      .on('response', response => {
        // In order to avoid https://github.com/expressjs/cors/issues/134
        const accessControlAllowOriginHeader = response.headers['access-control-allow-origin']

        console.log('response status', response.statusCode)
        if(accessControlAllowOriginHeader && accessControlAllowOriginHeader !== localOrigin ){
          console.log(chalk.blue('Override access-control-allow-origin header from proxified URL : ' + chalk.green(accessControlAllowOriginHeader) + '\n'));
          response.headers['access-control-allow-origin'] = localOrigin;
        }
      })
    ).pipe(res);
  });

  proxy.listen(port);

  // Welcome Message
  console.log(chalk.bgGreen.black.bold.underline('\n Proxy Active \n'));
  console.log(chalk.blue('Proxy Url: ' + chalk.green(cleanProxyUrl)));
  console.log(chalk.blue('PORT: ' + chalk.green(port)));
  console.log(chalk.blue('Credentials: ' + chalk.green(credentials)));
  console.log(chalk.blue('Remote Origin: ' + chalk.green(remoteOrigin)));
  console.log(chalk.blue('Local Origin: ' + chalk.green(localOrigin) + '\n'));
  console.log(
    chalk.cyan(
      'To start using the proxy simply replace the proxied part of your url with: ' +
        chalk.bold('http://localhost:' + port + '/\n')
    )
  );
};

exports.startProxy = startProxy;
