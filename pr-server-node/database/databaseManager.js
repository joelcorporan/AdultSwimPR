/**
 * The DatabaseManager module connect to the databases and provide
 * execution of queries to store and retreive information.
 * @author Joel R. Corporan
 */

/**
* Module Import
*/
var SQLClient = require('pg');

module.exports = function DatabaseManager(SQLconnection) {

	var pgClient = new SQLClient.Client(SQLconnection);

	// Connect method to connect to the PostgreSQL Server
	pgClient.connect(function(err) {
		if(err) {
			console.error("Could not connect to postgres", err)
		}
		else {
			console.log("PostgreSQL Database Connected")
		}
	});


	/* It use to for the execution of queries and retrieving of information
	 * @param query Statement of SQL
	 * @param values Use for values to insert on the SQL
	 * @param callback Parameter use for Database result
	 */
	this.query = function(query, values, callback) {
		pgClient.query(query, values, function(error, result) {
			if(error) {
				callback(error, null);
			}
			else {
				callback(null, result);
			}
		});
	}
}
