var http = require('http'),
	conf = require('./conf'),
	expressServer = require('./app/expressServer'),
	socketIO = require('./app/socketIO'),
    Request = require('request');

var Workers = function(config){
	config = config || {}

	
	console.log('Inicia conexión');

	var app = new expressServer({parameters : conf });

	this.server = http.createServer(app.expressServer);

	var Io = new socketIO({server:this.server});

	var CronJob = require('cron').CronJob;
	var job = new CronJob('00 06 * * *', function() {
		//console.log(conf.ApiTiie, conf.ActualizaTiiesEndpoint);
		let url = conf.ApiTiie + conf.ActualizaTiiesEndpoint;
		Request.post({
			url: url,
			json: true
			}, (error, response, body) => {
				if (!error && response && body) {
					console.log ('Se actualizaron las tasas.');
				}
			}
		);
	}, null, true, 'America/Mexico_City');
	job.start();
}

Workers.prototype.run = function(){
	this.server.listen(conf.port);
}

if(module.parent){
	module.exports = Workers;
} else {
	var workers = new Workers();
	workers.run();
	console.log('Modo debug');
}