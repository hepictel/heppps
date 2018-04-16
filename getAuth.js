/*
 * HEPIC API Auth
 */


var request = require('request');
var getAuth = function(config){

    request({
	  uri: config.apiSess,
	  method: "POST",
	  form: config.auth,
	  jar: config.jar
	}, function(error, response, body) {
          if (!body) {
		console.log('API Error connecting to '+ config.apiUrl);
		console.log(response);
		return false;
	  } else {
		//if (config.debug) console.log(body);
		if (response.statusCode == 200){
			var status = JSON.parse(body).auth;
			if (!status){
				  console.log('API Auth Failure!', status);
				  return false;
			}
			console.log('API Auth Success!', status);
			return status;
		} else {
			console.log('ERROR:',response.statusCode);
			return false;
		}
	  }
    });


}

module.exports = getAuth;
