/**
 * This module is in charge stream a video asset from a certain project.
 * @author: Joel R. Corporan
 */

/**
 * Module Import
 */
var uuid = require('uuid')
var proxy = require('../mediaSilo/videoProxy.js');
var api = require('../mediaSilo/mediaSiloAPI.js');

module.exports = function VideoManager(sqlConnection) {
	 
	 var pgClient = sqlConnection;

	/**
	 * This method gets the video asset from a certain project to the user.
	 * @param credentials: Credentials of the user.
	 * @param assetId: Asset ID of the where to find the asset in a project.
	 * @param callback_getVideoAsset: A callback function to return the result of the request.
	 */
	this.handlerPrepareAsset = function(request, assetId, callback_getVideoAsset) {
		getPrepareAsset(request, assetId, callback_getVideoAsset);
	}

	this.handlerVideoAsset = function(videoToken, res) {

		const query = "SELECT * FROM monkie WHERE temporary_url = $1";
		const values = [videoToken];

		pgClient.query(query, values, function(err, result) {
			if(!err) {
				if(!result.rows[0].credentials) {
					res.status(403);
                	res.send('Invalid Request');
				}
				else {
					proxy.getProxy(result.rows[0].credentials, result.rows[0].temporary_asset, res);
				}
			}
			else {
				res.status(403);
                res.send('Invalid Request');
			}
		});
	}

	/**
	 * This method gets the video asset from proxy.
	 * @param credentials: Credentials of the user.
	 * @param assetId: Asset ID of the where to find the asset in a project.
	 * @param callback_getVideoAsset: A callback function to return the result of the request.
	 */
	var getPrepareAsset = function(request, assetId, callback_getVideoAsset) {
		var videoToken = uuid.v4();

		const query = "UPDATE monkie SET temporary_url = $1, temporary_asset = $2 WHERE email = $3";
		const values = [videoToken, assetId, request.email];

		pgClient.query(query, values, function(err, result) {
			if(!err) {
				api.get('GETWATERMARK', assetId + "/watermark/" + request.id, request.credentials, null, function(error, found) {
					if(!error) {
						callback_getVideoAsset(null, videoToken);
					}
					else {
						callback_getVideoAsset(error, null);
					}
				});
			}
			else {
				callback_getVideoAsset(err, null);
			}
		});
	}
}