var ApiinventarioView = require('../views/reference'),
    ApiinventarioModel = require('../models/dataAccess')


var Apiinventario = function(conf) {
    this.conf = conf || {};

    this.view = new ApiinventarioView();
    this.model = new ApiinventarioModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

Apiinventario.prototype.get_inventory = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
    { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT }];

    self.model.query('uspGetDocumentosInventario', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
Apiinventario.prototype.get_Lote = function(req, res, next) {

    var self = this;

    var params = [{ name: 'estatusCID', value: req.query.estatusCID, type: self.model.types.INT },
    { name: 'idtipoproceso', value: req.query.idtipoproceso, type: self.model.types.STRING }];

    self.model.query('uspGetLoteInteres', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

Apiinventario.prototype.get_LoteDetail = function(req, res, next) {

    var self = this;

    var params = [{ name: 'LoteDetail', value: req.query.LoteDetail, type: self.model.types.INT }];

    self.model.query('uspGetLoteInteresDetalle', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
Apiinventario.prototype.get_inventarioPoliza = function(req, res, next) {

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

Apiinventario.prototype.get_inventarioPolizaDetalle = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idtipopoliza', value: req.query.idtipopoliza, type: self.model.types.INT },
    { name: 'empresaID', value: req.query.empresaID, type: self.model.types.INT },
    { name: 'sucursalID', value: req.query.sucursalID, type: self.model.types.INT },
    { name: 'CCP_IDDOCTO', value: req.query.CCP_IDDOCTO, type: self.model.types.STRING },
    { name: 'idfinancieraO', value: req.query.idfinancieraO, type: self.model.types.INT },
    { name: 'idEsquemaO', value: req.query.idEsquemaO, type: self.model.types.INT },
    { name: 'idfinancieraD', value: req.query.idfinancieraD, type: self.model.types.INT },
    { name: 'idEsquemaD', value: req.query.idEsquemaD, type: self.model.types.INT },
    { name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },
    { name: 'montoFinanciar', value: req.query.montoFinanciar, type: self.model.types.DECIMAL },
    { name: 'fechaInicio', value: req.query.fechaInicio, type: self.model.types.STRING }];

    self.model.query('Pol_Poliza6Detalle_INS', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
module.exports = Apiinventario;
