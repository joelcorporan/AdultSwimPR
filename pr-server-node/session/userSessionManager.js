/**
 * UserSessionManager module is in charge of creating a session user.
 * @author Joel R. Corporan
 */

/**
 * Module Import
 */
var uuid = require('uuid');
var api = require('../mediaSilo/mediaSiloAPI.js');

module.exports =  function UserSessionManager(database) {

	var pgClient = database;

	/**
	 * This method handle the registration of the user on the server.
	 * @param request: The upcoming request from the user.
	 * @param callback_UserSession: A callback function to return the result of the request.
	 */
	this.handleUserSession = function(request, callback_UserSession) {
		isUser(request.user.email, function(found) {
			if(found) {
				console.log("Updating User: ", request.user.email);
				updateUser(request, callback_UserSession);
			}
			else {
				console.log("New User: ", request.user.email);
				registerUser(request, callback_UserSession);
			}
		});
	}

	/**
	 * This method handler the password change for the user.
	 * @param: request: The upcoming request from the user.
	 * @param callback_UserPasswordChange: A callback function to return the result of the request.
	 */
	this.handlerUserPasswordChange = function(email, credentials, userId, newPassword, callback_UserPasswordChange) {
		changePassword(email, credentials, userId, newPassword, callback_UserPasswordChange);
	}

	/*
	 * This method ends the session of the user.
	 * @param request: The upcoming request from the user.
	 * @param callback_endingSession: A callback function to return the result of the request.
	 */
	this.handlerUserSessionEnding = function(request, callback_endingSession) {
		endSession(request, callback_endingSession);
	}

	this.handlerUserInfo = function(request, callback_UserInfo) {
		getInfo(request, callback_UserInfo);
	}

	/**
	 * This method check if the user who is requesting is a user.
	 * @param user: User requesting
	 * @param callback_isUser: A callback function to return the result of the request.
	 */
	var isUser = function(user, callback_isUser) {
		pgClient.query("SELECT email FROM monkie WHERE email = $1", [user], function(err, result) {
			if(!err) {
				if(!result.rowCount <= 0) {
					callback_isUser(true);
				}
				else {
					callback_isUser(false);
				}
			}
		});
	}

	/**
	 * This method register the user.
	 * @param request: The upcoming request from the user.
	 * @param callback_RegistratingUser: A callback function to return the result of the request.
	 */
	var registerUser = function(request, callback_RegistratingUser) {
		var session = new Date().toString();
		var token = uuid.v4();

		const query = "INSERT INTO monkie (email, credentials, token, sessionTime, user_id) VAlUES ($1, $2, $3, $4, $5)"
		const values = [request.user.email, request.credentials, token, session, request.user.id];

		pgClient.query(query, values, function(err, result) {
			if(!err) {
				callback_RegistratingUser(null, {success:1, user:request.user, token: token});
			}
			else {
				console.log(err);
				callback_RegistratingUser(err, {success:3, error:err});
			}
		});
	}

	/**
	 * This method update the user.
	 * @param request: The upcoming request from the user.
	 * @param callback_UpdatingUser: A callback function to return the result of the request.
	 */
	var updateUser = function(request, callback_UpdatingUser) {
		var session = new Date().toString();
		var token = uuid.v4();

		const query = "UPDATE monkie SET credentials = $1, token = $2, sessionTime = $3, user_id = $4 WHERE email = $5";
		const values = [request.credentials, token, session, request.user.id, request.user.email];

		pgClient.query(query, values, function(err, result) {
			if(!err) {
				callback_UpdatingUser(null, {success:1, user:request.user, token: token});
			}
			else {
				callback_UpdatingUser(err, {success:3, error:err});
			}
		});
	}

	/**
	 * This method change the password for the user.
	 * @param request: The upcoming request from the user.
	 * @param userId: Unique id of the user.
	 * @param callback_UserPasswordChange: A callback function to return the result of the request.
	 */
	var changePassword = function(email, credentials, userId, newPassword,  callback_UserPasswordChange) {
		var decodeCredentials = new Buffer(credentials, 'base64').toString('ascii');
		var oldPassword = decodeCredentials.split(':')[1];

		api.get("UPDATEUSER", userId, credentials, {password: newPassword, oldPassword: oldPassword}, function(error, result) {
			if(!error) {
				persitPassword(email, credentials, newPassword, callback_UserPasswordChange);
	 		}
	 		else {
	 			callback_UserPasswordChange(error, null);
	 		}
		});
	}

	var persitPassword = function(email, credentials, newPassword, callback_UserPasswordChange) {
		var decodeCredentials = new Buffer(credentials, 'base64').toString('ascii');
		var newCredentials = decodeCredentials.split(':')[0] + ":" + newPassword;

		var encodeCredentials = new Buffer(newCredentials).toString('base64');

		var query = "UPDATE monkie SET credentials = $1 WHERE email = $2"
		var value = [encodeCredentials, email];
		
		pgClient.query(query, value, function(error, result) {
			if(!error) {
				callback_UserPasswordChange(null, {success:1});
			}
			else {
				callback_UserPasswordChange(error, null);
			}
		});
	}

	/**
	 * This method end the session for the user.
	 * @param request: The upcoming request from the user.
	 * @param callback_endingSession: A callback function to return the result of the request.
	 */
	var endSession = function(request, callback_endingSession) {
		var query = "UPDATE monkie SET user_id = NULL, token = NULL, credentials = NULL, sessionTime = NULL, temporary_asset = NULL, temporary_url = NULL WHERE token = $1"
		var value = [request]
		
		pgClient.query(query, value, function(error, result) {
			if(!error) {
				callback_endingSession(null, {success:1});
			}
			else {
				callback_endingSession(error,{success:1});
			}
		});
	}

	var getInfo = function(request, callback_UserInfo) {

		// Module Import
		var http = require('https');
		var options = {
	        "method": "GET",
	        "hostname": "api.mediasilo.com",
	        "port": null,
	        "path": "/v3/me",
	        "headers": {
	            "mediasilohostcontext": process.env.hostname,
	            "authorization": "Basic " + request.credentials
	        }
	    };

	    // Check if the user is a current MediaSilo User.
	    var request = http.request(options, function (response, error) {
	        var chunks = [];

	        response.on("error", function(error) {
	            if (error) {
	                callback_UserInfo(error, null);
	            }
	        });

	        response.on("data", function(chunk) {
	            chunks.push(chunk);
	        });

	        response.on('end', function() {

	            if(error) {
	                callback_UserInfo(error, null);
	            }

	            if(!response) {
	                callback_UserInfo(error, null);
	            }

	            else {
	                if(response.statusCode == 200) {
	                    var body = Buffer.concat(chunks); 
	                    var info = JSON.parse(body);

	                    callback_UserInfo(null, info);
	                }
	                else {
	                    callback_UserInfo(error, null);
	                }
	            }
	        });  
	    });

	    request.end();
	}
}
