/**
 * Copyright (C) Joel R Corporan - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Joel Corporan <joel.corporan@gmail.com>, February 2016, Case Number:1-3166280427
 *
 * Creates the server, listen for requests and routes
 * the request for its respective handler.
**/
var express = require('express');
var bodyParser = require('body-parser');

var routes = require('./request-handlers/routes.js');
var RequestHandlers = require('./request-handlers/handlers.js');
var Database = require('./database/databaseManager.js');

var app = express();

// Connection URLs for Databases.
var SQLconnection = "postgres://postgres:AdultSwimMusicode@localhost:5432/adultswimpr";

var db = new Database(SQLconnection);
var handlers = new RequestHandlers(db);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({strict: false}));

// Make sure all request return CORS headers
app.use(function (req, res, next) {
    var origin = req.get('origin');
    if (!origin || origin === 'undefined' || origin.length == 0) {
        origin = req.get('host');
    }
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, token');

    next();
});

// MediaSiloHostContext
process.env['hostname'] = 'cartoonprdev';

routes(app, handlers, db);

createServer();

/**
 * Creates the server.
 */
function createServer() {
	
  var port = 3000;
  app.listen(port);

	console.log("Express server listening on port %d in %s mode", port, app.settings.env);
}
