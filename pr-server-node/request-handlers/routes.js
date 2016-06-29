/**
 * This module received all requests and give them to its respective handler.
 * @author: Joel R. Corporan
 */

var isAuthorizeUser = require('./isAuthorizeUser.js');
var isMediaSiloUser = require('../session/isMediaSiloUser.js');

module.exports = function Route(app, handlers, db) {

	// This route handler user's session.
	app.post('/userSession', isMediaSiloUser, handlers.handleUserSession);

	// This route handle the user's info.
	app.get('/getInfo', isAuthorizeUser(db), handlers.handlerInfo);

	// This route handle user's password change.
	app.post('/changePassword', isAuthorizeUser(db), handlers.handlerPasswordChange);

	// This route handle ending of user's session.
	app.get('/endUserSession', handlers.handlerEndSession);

	// This route handle user projects.
	app.get('/getProjects', isAuthorizeUser(db), handlers.handlerProjects);

	// This route handle user Assets.
	app.get('/getAssets', isAuthorizeUser(db), handlers.handlerAssets);

	// This route handle user Assets.
	app.get('/getAssetsByName', isAuthorizeUser(db), handlers.handlerAssetsByName);

	// This route handle project specific assest.
	app.get('/getAssetRequest', isAuthorizeUser(db), handlers.handlerAssetRequest);

	// This route handle the video to user.
	app.get('/proxy.m3u8', handlers.handlerVideo);

	//Route for crossdomain file to support flash fallback
	app.get('*/crossdomain.xml', function (req, res, next) {
	    var xDomainXml = '<cross-domain-policy><allow-access-from domain="*" secure="false"/><allow-http-request-headers-from domain="*" headers="*"/></cross-domain-policy>'

	    res.header('content-type', 'application/xml');
	    res.send(xDomainXml);
	    return next();
	});

	// handling 404 errors
	app.use(function(err, req, res, next) {
	  if(err.status !== 404) {
	    return next();
	  }
	 
	  res.send(err.message || '** no unicorns here **');
	});

};
