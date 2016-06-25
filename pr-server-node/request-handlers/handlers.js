/**
 * ResquestHandler module is in charge of handling all the requests received.
 * @author Joel R. Corporan
 */

/**
 * Module Import
 */
var SessionManager = require('../session/userSessionManager.js');
var ProjectsManager = require('../projects/ProjectsManager.js')
var VideoManager = require('../projects/videoManager.js');
var video = require('../mediaSilo/videoProxy.js');

module.exports = function ResquestHandler(SQLDatabase) {

	var sqlConnection = SQLDatabase;

	/**
	 * This method handler the session.
	 * @param req: Request from the device.
	 * @param res: Route to response the device.
	 */
	this.handleUserSession = function(req, res) {
		var request = req.params;
		
		var session = new SessionManager(sqlConnection);
		session.handleUserSession(request, function(error, found) {
			
			if(error) {
				res.status(500);
				res.send("Error Registring User");
			}
			else {
				//res.header('Access-Control-Expose-Headers', 'token');
				//res.set('token', found.token);
				//res.send({success: found.success, user: found.user});
				res.send({id: found.token});
			}
		});
	}

	this.handlerInfo = function(req, res) {
		var request = req.params;
	
		var session = new SessionManager(sqlConnection);
		session.handlerUserInfo(request, function(error, found) {
			if(error) {
				res.status(500);
				res.send("Error Getting Info");
			}
			else {
				res.send(found);
			}
		});
	}

	/**
	 * This method handler the password change of the user.
	 * @param req: Request from the device.
	 * @param res: Route to response the device.
	 */
	this.handlerPasswordChange = function(req, res) {
		var email = req.params.email;
		var credentials = req.params.credentials;
		var userId = req.headers.userid;
		var newPassword = req.headers.newpassword;

		var session = new SessionManager(sqlConnection);
		session.handlerUserPasswordChange(email, credentials, userId, newPassword, function(error, found) {
			if(error) {
				res.status(500);
				res.send("Error changing password");
			}
			else {
				res.send({success: found.success});
			}
		});
	}

	/**
	 * This method handler the ending of a session.
	 * @param req: Request from the device.
	 * @param res: Route to response the device.
	 */
	this.handlerEndSession = function(req, res) {
		var request = req.headers.token;

		var session = new SessionManager(sqlConnection);
		session.handlerUserSessionEnding(request, function(error, found) {
			if(error) {
				res.status(500);
				res.send("Error ending session");
			}
			else {
				res.send({success: found.success});
			}
		});
	}

	/**
	 * This method handler the projects.
	 * @param req: Request from the device.
	 * @param res: Route to response the device.
	 */
	this.handlerProjects = function(req, res) {
		var credentials = req.params.credentials;

		var project = new ProjectsManager();
		project.handlerProjects(credentials, function(error, found) {
			if(error) {
				res.status(500);
				res.send("Error retrieving projects");
			}
			else {
				res.send(found);
			}
		});
	}

	/**
	 * This method handler the assets attached to a project.
	 * @param req: Request from the device.
	 * @param res: Route to response the device.
	 */
	this.handlerAssets = function(req, res) {
		var credentials = req.params.credentials;
		var projectId = req.query.id;

		var project = new ProjectsManager();
		project.handlerAssets(credentials, projectId, function(error, found) {
			if(error) {
				res.status(500);
				res.send("Error retrieving assets");
			}
			else {
				res.send(found);
			}
		});
	}

	/**
	 * This method handler video asset from an specific project to the user.
	 * @param req: Request from the device.
	 * @param res: Route to response the device.
	 */
	this.handlerAssetRequest = function(req, res) {
		var email = req.params.email;
		var assetId = req.query.id;

		var videoAsset = new VideoManager(sqlConnection);
		videoAsset.handlerPrepareAsset(email, assetId, function(error, found) {
			if(error) {
				res.status(500);
				res.send("Error retrieving asset url");
			}
			else {
				res.send(found)
				//res.writeHead(200, {'Content-Type': 'image/jpeg'});
				//res.header('content-type', 'application/x-mpegurl; charset=utf-8');
            	//res.send(found.toString());
			}
		});
	}

	this.handlerVideo = function(req, res) {
		videoToken = req.query.id;
		
		var videoAsset = new VideoManager(sqlConnection);
		videoAsset.handlerVideoAsset(videoToken, res);
	}
}
