var ApiTraspasoView = require('../views/reference'),
    ApiTraspasoModel = require('../models/dataAccess')


var ApiTraspaso = function(conf) {
    this.conf = conf || {};

    this.view = new ApiTraspasoView();
    this.model = new ApiTraspasoModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};


ApiTraspaso.prototype.get_TraspasoFinanciera = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },
    { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
    { name: 'idtipopoliza', value: req.query.idtipopoliza, type: self.model.types.INT }];

    self.model.query('Pol_Cabecera_INS', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ApiTraspaso.prototype.get_TraspasoFinancieraDetalle = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idtipopoliza', value: req.query.idtipopoliza, type: self.model.types.INT },
    { name: 'idmovimiento', value: req.query.idmovimiento, type: self.model.types.INT },
    { name: 'idfinancieraO', value: req.query.idfinancieraO, type: self.model.types.INT },
    { name: 'idEsquemaO', value: req.query.idEsquemaO, type: self.model.types.INT },
    { name: 'idfinancieraD', value: req.query.idfinancieraD, type: self.model.types.INT },
    { name: 'idEsquemaD', value: req.query.idEsquemaD, type: self.model.types.INT },
    { name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },
    { name: 'dobleEstrella', value: req.query.dobleEstrella, type: self.model.types.INT },
    { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT }
    ];
    console.log(params)

    self.model.query('Pol_Poliza5Detalle_INS', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiTraspaso.prototype.get_TraspasoEsquemaDetalle = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idpoliza', value: req.query.idpoliza, type: self.model.types.INT },
    { name: 'idmovimiento', value: req.query.idmovimiento, type: self.model.types.INT },
    { name: 'idfinancieraO', value: req.query.idfinancieraO, type: self.model.types.INT },
    { name: 'idEsquemaO', value: req.query.idEsquemaO, type: self.model.types.INT },
    { name: 'idfinancieraD', value: req.query.idfinancieraD, type: self.model.types.INT },
    { name: 'idEsquemaD', value: req.query.idEsquemaD, type: self.model.types.INT },
    { name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT }];

    self.model.query('Pol_CambioEsquema_INS', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ApiTraspaso.prototype.get_unidadEnProceso = function(req, res, next) {

    var self = this;

    var params = [{ name: 'documento', value: req.query.documento, type: self.model.types.STRING },
    { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT }];

    self.model.query('usp_get_unidadEnProceso', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

module.exports = ApiTraspaso;
