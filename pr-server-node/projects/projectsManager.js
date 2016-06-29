/**
 * This module handle the projects attached to the user.
 * @author: Joel R. Corporan
 */

/**
 * Module import
 */
var api = require('../mediaSilo/mediaSiloAPI.js');

module.exports = function ProjectManager() {
	
	/**
	 * This method handler the projects for the user.
	 * @param credentials: Credentials of the user.
	 * @param callback_getProjects: A callback function to return the result of the request.
	 */
	this.handlerProjects = function(credentials, callback_getProjects) {
		getProjects(credentials, callback_getProjects);
	}

	/**
	 * This method handler the assets to the user
	 * @param credentials: Credentials of the user.
	 * @param projectId: Project ID of the where to find the assets.
	 * @param callback_getAssets: A callback function to return the result of the request.
	 */
	this.handlerAssets = function(credentials, projectId, callback_getAssets) {
		getAssets(credentials, projectId, callback_getAssets);
	}

	/**
	 * This method handler the assets to the user
	 * @param credentials: Credentials of the user.
	 * @param projectId: Project ID of the where to find the assets.
	 * @param callback_getAssets: A callback function to return the result of the request.
	 */
	this.handlerAssetsByName = function(credentials, projectName, callback_getAssets) {
		getProjects(credentials, function(error, found) {
			if(!error) {
				for (var i = 0; i < found.length; i++) {
					if(found[i].name) {
						if(projectName == found[i].name) {
							getAssets(credentials, found[i].id, callback_getAssets);
							break;
						}
					}
					else {
						callback_getAssets("Not found", null);
					}
				}
			}
			else {
				callback_getAssets(error, null);
			}
		});
	}

	/**
	 * This method gets the projects attached to the user.
	 * @param credentials: Credentials of the user.
	 * @param callback_UserSession: A callback function to return the result of the request.
	 */
	var getProjects = function(credentials, callback_getProjects) {
	 	api.get('GETPROJECTS', "", credentials, null, function(error, result) {
	 		if(!error) {
	 			callback_getProjects(null, result);
	 		}
	 		else {
	 			callback_getProjects(error, null);
	 		}
	 	});
	 }

	/**
	 * This method gets the assets of a specific project to the user.
	 * @param credentials: Credentials of the user.
	 * @param projectId: Project ID of the where to find the assets.
	 * @param callback_getAssets: A callback function to return the result of the request.
	 */
	var getAssets = function(credentials, projectId, callback_getAssets) {
	 	api.get('GETASSETS', projectId + '/assets', credentials, null, function(error, result) {
	 		if(!error) {
	 			callback_getAssets(null, result);
	 		}
	 		else {
	 			callback_getAssets(error, null);
	 		}
	 	});
	 }
}