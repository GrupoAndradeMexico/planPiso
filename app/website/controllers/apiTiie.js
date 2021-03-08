var ApiTiieView = require('../views/reference'),
    ApiTiieModel = require('../models/dataAccess'),
    cron = require('node-cron'),
    Request = require('request')

var ApiTiie = function(conf) {
    this.conf = conf || {};

    this.view = new ApiTiieView();
    this.model = new ApiTiieModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

ApiTiie.prototype.get_Tiie = function(req, res, next) {

    var self = this;

    var params = [];

    self.model.query('uspGetTiie', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiTiie.prototype.get_TiieDateExist = function(req, res, next) {

    var self = this;

    var params = [{ name: 'fecha', value: req.query.fecha, type: self.model.types.STRING }];

    self.model.query('uspGetTiieDateExist', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ApiTiie.prototype.get_insertTiie = function(req, res, next) {

    var self = this;

    var params = [{ name: 'fecha', value: req.query.fecha, type: self.model.types.STRING },
        { name: 'porcentaje', value: req.query.porcentaje, type: self.model.types.INT },
        { name: 'userID', value: req.query.userID, type: self.model.types.INT }
    ];

    self.model.query('uspInsTiie', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiTiie.prototype.get_actualizaTiie = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idTIIE', value: req.query.idTIIE, type: self.model.types.STRING },
        { name: 'porcentaje', value: req.query.porcentaje, type: self.model.types.INT }
    ];

    self.model.query('ACTUALIZATIIE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ApiTiie.prototype.get_ultimaFechaTiie = function(req, res, next) {

    var self = this;

    var params = [];

    self.model.query('SEL_ULTIMA_FECHA_TIIE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ApiTiie.prototype.post_insertarTiie = function(req, res, next) {

    var self = this;

    var params = [
        { name: 'fecha', value: req.body.fecha, type: self.model.types.STRING },
        { name: 'tasa', value: req.body.tasa, type: self.model.types.STRING }
    ];

    self.model.query('INS_TIIE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiTiie.prototype.get_ejecutaTiie = function(req, res, next) {

    var self = this;

    actualizaTiiesDesdeBanxico();
};
cron.schedule('00 09 * * *', () => {
    actualizaTiiesDesdeBanxico();
    notificaciones();
});
// NodeCron.schedule('1 * * * *', () => {
//     console.log('se ejecuto cron');
//     // actualizaTiiesDesdeBanxico();
//     // notificaciones();

// });
var notificaciones = function() {
    let url = 'http://localhost:4900/api/apiNotificaciones/notificaciones/';
    Request.post(url, (error, response, body) => {
        if (error) {
            console.log('error', error);
        };
    });
};

var actualizaTiiesDesdeBanxico = function() {
    recuperaUltimaFechaTiie();
}

var recuperaUltimaFechaTiie = function() {
    let url = 'http://localhost:4900/api/apiTiie/ultimaFechaTiie';
    Request.get(url, (error, response, body) => {
        if (!error && response && body) {
            var bodyAsObject = JSON.parse(body);
            var ultimaFecha = bodyAsObject[0].UltimaFecha;
            var fechaISO = new Date(ultimaFecha).toISOString().slice(0, 10);

            recuperaTiiesDesdeBanxicoDesdeFecha(fechaISO);
        }
    });
}

var recuperaTiiesDesdeBanxicoDesdeFecha = function(fechaInicial) {
    var fechaDeHoy = new Date().toISOString().slice(0, 10);

    if (fechaInicial == fechaDeHoy)
        return;

    let url = 'https://www.banxico.org.mx/SieAPIRest/service/v1/series/SF43783/datos/' + fechaInicial + '/' + fechaDeHoy;
    Request.get({
        url: url,
        headers: {
            'Bmx-Token': '818165c998d9dd09b8fbb4bc4544f2216990e36738b3c707260809f8ffb8e916'
        }
    }, (error, response, body) => {
        if (!error && response && body) {
            var bodyAsObject = JSON.parse(body);
            var serie = bodyAsObject.bmx.series[0].datos;

            serie.forEach(tasa => insertaTiie(tasa.fecha, tasa.dato));
        }
    });
}

var insertaTiie = function(fecha, tasa) {
    let url = 'http://localhost:4900/api/apiTiie/insertarTiie';
    Request.post({
        url: url,
        body: {
            'fecha': fecha,
            'tasa': tasa,
        },
        json: true
    }, (error, response, body) => {
        if (!error && response && body) {
            console.log('Se insertó tasa: ' + fecha + ' - ' + tasa);
        }
    });
}
ApiTiie.get_notificaciones = function(req, res, next) {

    var self = this;

};

module.exports = ApiTiie;