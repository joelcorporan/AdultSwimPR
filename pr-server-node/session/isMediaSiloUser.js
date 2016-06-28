/*
 * This module check is the user is a MediaSilo user.
 * @author: Joel R. Corporan
 */
module.exports = function(req, res, next) {

	// Module Import
	var http = require('https');
    var credentials = new Buffer(req.body.username + ":" + req.body.password).toString('base64');
	var options = {
        "method": "GET",
        "hostname": "api.mediasilo.com",
        "port": null,
        "path": "/v3/me",
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
                res.status(500);
                res.send('Error validating user');
            }
        });

        response.on("data", function(chunk) {
            chunks.push(chunk);
        });

        response.on('end', function() {

            if(error) {
                res.status(500)
                res.send('Error validating user');
            }

            if(!response) {
                res.status(500);
                res.send('Error validating user');
            }
            else {
                if(response.statusCode == 200) {
                    var body = Buffer.concat(chunks); 
                    var info = JSON.parse(body);
                    req.params.user = info;
                    req.params.credentials = credentials;
                    next();
                }
                else {
                    res.status(403);
                    res.send('Invalid User');
                }
            }
        });  
    });

    request.end();
}