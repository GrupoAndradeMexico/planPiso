var ApiAplicaPagosView = require('../views/reference'),
    ApiAplicaPagosModel = require('../models/dataAccess')


var ApiAplicaPagos = function(conf) {
    this.conf = conf || {};

    this.view = new ApiAplicaPagosView();
    this.model = new ApiAplicaPagosModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};


ApiAplicaPagos.prototype.get_Lote = function(req, res, next) {

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

ApiAplicaPagos.prototype.get_LoteDetail = function(req, res, next) {

    var self = this;

    var params = [{ name: 'planpisoID', value: req.query.planpisoID, type: self.model.types.INT }];

    self.model.query('uspGetLoteInteresDetalle', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ApiAplicaPagos.prototype.get_buscarLotes = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
    { name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },
    { name: 'fecha_ini', value: req.query.fechaInicio, type: self.model.types.STRING },
    { name: 'fecha_fin', value: req.query.fechaFin, type: self.model.types.STRING }];

    self.model.query('SEL_BUSCA_LOTE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ApiAplicaPagos.prototype.get_detalleLote = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idLote', value: req.query.idLote, type: self.model.types.INT }];

    self.model.query('usp_get_detalleLote', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ApiAplicaPagos.prototype.get_sacarPlanPiso = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idLote', value: req.query.idLote, type: self.model.types.INT },
    { name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT }];

    self.model.query('upd_sacaPlanPiso', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ApiAplicaPagos.prototype.get_agregaIntesesLote = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idLote', value: req.query.idLote, type: self.model.types.INT }];

    self.model.query('UPD_Lote_OrdeCompra_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ApiAplicaPagos.prototype.get_detalleBitacora = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idLote', value: req.query.idLote, type: self.model.types.INT }];

    self.model.query('udp_get_detalleIntereses', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

module.exports = ApiAplicaPagos;
