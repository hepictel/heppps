#!/usr/bin/env node
var dgram = require('dgram');
var getAuth = require('./getAuth');
var argv = require('minimist')(process.argv.slice(2));

var timeOut = argv.timeOut || 120 ;
argv.apiUrl = argv.apiUrl || 'http://127.0.0.1/api';
argv.apiUser = argv.apiUser || 'username';
argv.apiPass = argv.apiPass || 'password';
argv.url = argv.apiUrl + '/v2/statistic/data';
argv.apiSess = argv.apiSess || argv.apiUrl + '/v2/session';
argv.type = argv.type || [ "total_pps","calls_pps","regs_pps" ];
argv.udp = argv.udp || false;
argv.backend = argv.backend || 'cassandra';

var request = require('request');
var homercookie = request.cookie("PCAPTURESESSION="+Math.random().toString(36).slice(2)+";path=/");
argv.jar = request.jar();
argv.jar.setCookie(homercookie, argv.apiSess, function(error, cookie) {});
argv.auth = JSON.stringify({ "username": argv.apiUser, "password": argv.apiPass, auth_type: "local" });

var scheduleAuth = function(){
	getAuth(argv);
	setInterval(function() {
	    getAuth(argv);
	}, timeOut*1000 );
}

if(argv.udp) {
  var UDP_HOST = udp.split(':')[0];
  var UDP_PORT = udp.split(':')[1];
  var client = dgram.createSocket('udp4');
}

var sendUDP = function (message) {
  if (argv.debug) console.log('Sending Message',message,HOST,PORT);
  client.send(message, 0, message.length, UDP_PORT, UDP_HOST, function(err, bytes) {
    if (err) { throw err; client.close(); }
  });
}

var fromts,tots,params;
if (argv.backend == 'cassandra'){
    params = JSON.stringify( {"timestamp":{"from":fromts,"to":tots},"param":{"filter":["@filters"],"limit":500,"total":argv.total||false,"query":[{"main":"hepic_statistics_all","database":"hepic","type":argv.type,"tag":[]}],"precision":60,"bfrom":fromts}} );
} else {
    params = JSON.stringify({"timestamp":{"from":fromts,"to":tots},"param":{"filter":["@filters"],"limit":500,"total":argv.total||false,"query":[{"main":"proto","type":["hepall"],"tag":[]}],"precision":60}});
}
scheduleAuth();

setInterval(function () {
    tots = new Date().getTime() - (argv.interval || 60000);
    fromts = tots - (argv.interval || 60000);
    params = JSON.stringify( {"timestamp":{"from":fromts,"to":tots},"param":{"filter":["@filters"],"limit":500,"total":argv.total||false,"query":[{"main":"hepic_statistics_all","database":"hepic","type":argv.type,"tag":[]}],"precision":60,"bfrom":fromts}} );
    console.log('GET:',argv.url, fromts, tots);
    request({
	  uri: argv.url,
	  method: "POST",
	  headers: { "Content-Type": "application/json" },
          form: params,
	  jar: argv.jar
	}, function(error, response, body) {
	   console.log(body);
	   var data = JSON.parse(body).data[0];
           data.forEach(function(row){
		if (argv.debug) console.log(row);
		if (argv.udp) { sendUDP(JSON.stringify(row)); return; }
	   });
	});

}, argv.interval || 60000)

console.warn('PPS/CPU Counter started...', argv)
