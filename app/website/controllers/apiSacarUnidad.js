var ApisacarunidadView = require('../views/reference'),
    ApisacarunidadModel = require('../models/dataAccess')
var soap = require('soap');
var parseString = require('xml2js').parseString;

var Apisacarunidad = function(conf) {
    this.conf = conf || {};

    this.view = new ApisacarunidadView();
    this.model = new ApisacarunidadModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

Apisacarunidad.prototype.get_documentos = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT }];

    self.model.query('UspGetDocumentosSacarUnidad', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
Apisacarunidad.prototype.get_saldoCuenta = function(req, res, next) {

    var self = this;

    var params = [{ name: 'empresaSeleccionada', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'nombreCuenta', value: req.query.cuenta, type: self.model.types.STRING }
    ];

    self.model.query('usp_get_saldoCuentaBanco', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

Apisacarunidad.prototype.get_interesUnidad = function(req, res, next) {

    var self = this;

    var params = [{ name: 'docto', value: req.query.documento, type: self.model.types.STRING },
        { name: 'idfinanciera', value: req.query.idProveedor, type: self.model.types.INT },
        { name: 'saldo', value: req.query.monto, type: self.model.types.DECIMAL }
    ];
    console.log(params)
    self.model.queryAllRecordSet('Usp_CalculaPagoInteres_INS', params, function(error, result) {
        console.log(result)
        console.log(error)
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

Apisacarunidad.prototype.get_encabezadoPreLote = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idLote', value: req.query.idLote, type: self.model.types.INT },
        { name: 'idProveedor', value: req.query.idProveedor, type: self.model.types.INT }
    ];
    self.model.query('upd_preLote_sp', params, function(error, result) {
        console.log(result)
        console.log(error)
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

Apisacarunidad.prototype.get_polizaInteres = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idPreLote', value: req.query.idPreLote, type: self.model.types.INT },
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'documento', value: req.query.documento, type: self.model.types.STRING },
        { name: 'idproveedor', value: req.query.idproveedor, type: self.model.types.INT },
        { name: 'saldoDocumento', value: req.query.saldoDocumento, type: self.model.types.DECIMAL },
        { name: 'saldoInteres', value: req.query.saldoInteres, type: self.model.types.DECIMAL },
        { name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT }
    ];
    console.log(params)
    self.model.query('UspGeneraOrdenCompra_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

Apisacarunidad.prototype.post_bitacorainteres = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idmovimiento', value: req.body.idmovimiento, type: self.model.types.INT },
        { name: 'idfinanciera', value: req.body.idfinanciera, type: self.model.types.INT },
        { name: 'idesquema', value: req.body.idesquema, type: self.model.types.INT },
        { name: 'saldo', value: req.body.saldo, type: self.model.types.DECIMAL },
        { name: 'puntos', value: req.body.puntos, type: self.model.types.DECIMAL },
        { name: 'tiie', value: req.body.tiie, type: self.model.types.DECIMAL },
        { name: 'penetracion', value: req.body.penetracion, type: self.model.types.DECIMAL },
        { name: 'plazo', value: req.body.plazo, type: self.model.types.INT },
        { name: 'fechatiie', value: req.body.fechatiie, type: self.model.types.STRING },
        { name: 'fechainicio', value: req.body.fechainicio, type: self.model.types.STRING },
        { name: 'fechafin', value: req.body.fechafin, type: self.model.types.STRING },
        { name: 'Interes', value: req.body.Interes, type: self.model.types.DECIMAL },
        { name: 'dias', value: req.body.dias, type: self.model.types.INT },
        { name: 'totalInteres', value: req.body.totalInteres, type: self.model.types.DECIMAL },
        { name: 'tipo', value: req.body.tipo, type: self.model.types.STRING },
        { name: 'idLote', value: req.body.idLote, type: self.model.types.INT },
        { name: 'tasa', value: req.body.tasa, type: self.model.types.DECIMAL }
    ];
    console.log(params)
    self.model.query('INS_logInteresOrdendecompra_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


module.exports = Apisacarunidad;