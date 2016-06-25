
/**
 * This module connect to the MediaSilo API to make request to their system.
 * @author: Joel R. Corporan
 */
var requestType = {'GETPROJECTS': {'PATH': '/v3/projects/', 'METHOD': 'GET'}, 'GETASSETS': {'PATH': '/v3/projects/', 'METHOD': 'GET'}, 'UPDATEUSER': {'PATH': '/v3/users/', 'METHOD': 'PUT'} };

exports.get = function(type, id, credentials, body, callback) {

	// Module Import
	var http = require('https');
	var options = {
        "method": requestType[type].METHOD,
        "hostname": "api.mediasilo.com",
        "port": null,
        "path": requestType[type].PATH + id,
        "headers": {
            "mediasilohostcontext": process.env.hostname,
            "authorization": "Basic " + credentials
        }
    };

    // Check if the user is a current MediaSilo User.
    var request = http.request(options, function (response, error) {
        var chunks = [];

        response.on("error", function(error) {
            if (error) {
                error.status = 500;
                error.message = 'Error validating';
                callback(error, null);
            }
        });

        response.on("data", function(chunk) {
            chunks.push(chunk);
        });

        response.on('end', function() {
            if(response.statusCode == 200) {
                var body = Buffer.concat(chunks); 
                var info = JSON.parse(body);
                callback(null, info);
            }
            else if (response.statusCode == 204) {
                var body = Buffer.concat(chunks); 
                callback(null, info);
            }

            else {
                var err = {status:403, message: 'Invalid User'}
        		callback(err, null);
            }
        });  
    });

    request.end(JSON.stringify(body));
}