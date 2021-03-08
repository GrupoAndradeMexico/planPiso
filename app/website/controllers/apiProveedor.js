var ApiproveedorView = require('../views/reference'),
    ApiproveedorModel = require('../models/dataAccess')


var Apiproveedor = function(conf) {
    this.conf = conf || {};

    this.view = new ApiproveedorView();
    this.model = new ApiproveedorModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};
Apiproveedor.prototype.get_providers = function(req, res, next) {

    var self = this;

    var params = [{ name: 'empresaID', value: req.query.empresaID, type: self.model.types.INT },
    { name: 'sucursalID', value: req.query.sucursalID, type: self.model.types.STRING }];

    self.model.query('uspGetDocumentosProveedores', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

Apiproveedor.prototype.get_Lote = function(req, res, next) {

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

Apiproveedor.prototype.get_LoteDetail = function(req, res, next) {

    var self = this;

    var params = [{ name: 'planpisoID', value: req.query.planpisoID, type: self.model.types.INT }];

    self.model.query('uspGetLoteInteresDetalle', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
Apiproveedor.prototype.get_proveedorType = function(req, res, next) {

    var self = this;

    var params = [];

    self.model.query('USP_TipoProceso_GET', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
Apiproveedor.prototype.get_ProveedorPoliza = function(req, res, next) {

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

Apiproveedor.prototype.get_ProveedorPolizaDetalle = function(req, res, next) {

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

    self.model.query('Pol_Poliza4Detalle_INS', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
module.exports = Apiproveedor;
