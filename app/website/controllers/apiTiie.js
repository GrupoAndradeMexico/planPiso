var ApiTiieView = require('../views/reference'),
    ApiTiieModel = require('../models/dataAccess'),
    NodeCron = require('node-cron'),
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
    { name: 'userID', value: req.query.userID, type: self.model.types.INT }];

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
    { name: 'porcentaje', value: req.query.porcentaje, type: self.model.types.INT }];

    self.model.query('ACTUALIZATIIE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ApiTiie.prototype.post_actualizaTiiesDesdeBanxico = function (req, res, next) {
    actualizaTiiesDesdeBanxico(this.conf.parameters.ApiTiie, this.conf.parameters.UltimaFechaEndpoint, this.conf.parameters.InsertarEndpoint, this.conf.parameters.TokenBanxico, this.conf.parameters.ApiBanxico, this.conf.parameters.TiiesEndpoint);
    res.status(204).send();
};

ApiTiie.prototype.get_ultimaFechaTiie = function (req, res, next) {

    var self = this;

    var params = [];

    self.model.query('SEL_ULTIMA_FECHA_TIIE_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ApiTiie.prototype.post_insertarTiie = function (req, res, next) {
    
    var self = this;

    var params = [
        { name: 'fecha', value: req.body.fecha, type: self.model.types.STRING },
        { name: 'tasa', value: req.body.tasa, type: self.model.types.STRING }
    ];

    self.model.query('INS_TIIE_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

NodeCron.schedule('00 06 * * *', () => {
    actualizaTiiesDesdeBanxico(this.conf.parameters.ApiTiie, this.conf.parameters.UltimaFechaEndpoint, this.conf.parameters.InsertarEndpoint, this.conf.parameters.TokenBanxico, this.conf.parameters.ApiBanxico, this.conf.parameters.TiiesEndpoint);
});

var actualizaTiiesDesdeBanxico = function (apiTiie, ultimaFechaEndpoint, insertarEndpoint, tokenBanxico, apiBanxico, tiiesEndpoint) {
    console.log(apiTiie, ultimaFechaEndpoint, insertarEndpoint, tokenBanxico, apiBanxico, tiiesEndpoint);
    recuperaUltimaFechaTiie(apiTiie, ultimaFechaEndpoint, insertarEndpoint, tokenBanxico, apiBanxico, tiiesEndpoint);
}

var recuperaUltimaFechaTiie = function (apiTiie, ultimaFechaEndpoint, insertarEndpoint, tokenBanxico, apiBanxico, tiiesEndpoint) {
    let url = apiTiie + ultimaFechaEndpoint;
    Request.get(url, (error, response, body) => {
        if (!error && response && body) {
            var bodyAsObject = JSON.parse(body);
            var ultimaFecha = bodyAsObject[0].UltimaFecha;
            var fechaISO = new Date(ultimaFecha).toISOString().slice(0, 10);

            recuperaTiiesDesdeBanxicoDesdeFecha(fechaISO, apiTiie, insertarEndpoint, tokenBanxico, apiBanxico, tiiesEndpoint);
        }
    });
}

var recuperaTiiesDesdeBanxicoDesdeFecha = function (fechaInicial, apiTiie, insertarEndpoint, tokenBanxico, apiBanxico, tiiesEndpoint) {
    var fechaDeHoy = new Date().toISOString().slice(0, 10);

    if (fechaInicial == fechaDeHoy)
        return;

    let url = apiBanxico + tiiesEndpoint + fechaInicial + '/' + fechaDeHoy;
    Request.get({
        url: url,
        headers: {
            'Bmx-Token': tokenBanxico
        }
        }, (error, response, body) => {
            if (!error && response && body) {
                var bodyAsObject = JSON.parse(body);
                var serie = bodyAsObject.bmx.series[0].datos;

                serie.forEach(tasa => insertaTiie(tasa.fecha, tasa.dato, apiTiie, insertarEndpoint));
            }
        }
    );
}

var insertaTiie = function (fecha, tasa, apiTiie, insertarEndpoint) {
    let url = apiTiie + insertarEndpoint;
    Request.post({
        url: url,
        body: {
            'fecha': fecha,
            'tasa': tasa,
        },
        json: true
        }, (error, response, body) => {
            if (!error && response && body) {
                console.log ('Se insertó tasa: ' + fecha + ' - ' + tasa);
            }
        }
    );
}

module.exports = ApiTiie;
