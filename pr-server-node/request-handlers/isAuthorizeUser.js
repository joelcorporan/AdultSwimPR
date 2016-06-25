/*
 * This module is use to check if user's token still alive.
 */
module.exports = function(db) {

	var pgClient = db;

	return function(req, res, next) {
		pgClient.query("SELECT * FROM monkie WHERE token = $1", [req.headers.token], function(err, result) {
			if(!err) {
				if(!result.rowCount <= 0) {

					const t1 = new Date(result.rows[0].sessionTime);
					const t2 = new Date();
					const timeDifferent = Math.abs(t2 - t1);

					// If the user have been inactive for more than 2.5 hours has, it has to begin a new session
					if (timeDifferent > 9000000) {

						var query = "UPDATE monkie SET token = NULL, credentials = NULL, sessionTime = NULL WHERE email = $1"
						var value = [result.rows[0].email]
						
						pgClient.query(query, value, function(error, result2) {
							if(!error) {
								res.status(403);
								res.send('Session Ended');
							}
							else {
								res.status(500);
								res.send('Error validating session');
							}
						});
					}
					
					// If the user have been inactive for less that 2.5 hours, the session time will restset.
					else {
						var session = new Date().toString();
						var query = "UPDATE monkie SET sessionTime = $1 WHERE token = $2"
						var value = [session, req.headers.token]
						
						pgClient.query(query, value, function(error, result2) {
							if(!error) {
								req.params.credentials = result.rows[0].credentials;
								req.params.email = result.rows[0].email;
								next();
							}
							else {
								res.status(500);
								res.send('Error validating session');
							}
						});
					}
				}
				else {
					res.status(403);
					res.send('Invalid session');
				}
			}
			else {
				res.status(500);
				res.send('Error validating session');
			}
		});
	}
}