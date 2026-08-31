var ApiSabana2View  = require('../views/reference'),
    ApiSabana2Model = require('../models/dataAccess');

var ApiSabana2 = function(conf) {
    this.conf  = conf || {};
    this.view  = new ApiSabana2View();
    this.model = new ApiSabana2Model({ parameters: this.conf.parameters });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

ApiSabana2.prototype.get_datos = function(req, res, next) {
    var self = this;

    // idEmpresa ausente/null = todas las empresas; el SP acepta @idEmpresaFiltro NULL.
    var params = [
        { name: 'idEmpresaFiltro', value: req.query.idEmpresa || null, type: self.model.types.INT }
    ];

    self.model.queryLocalizado('uspGetSabanaPlanPisoModular', params, function(error, result) {
        self.view.expositor(res, { error: error, result: result });
    });
};

ApiSabana2.prototype.get_fechaefectiva = function(req, res, next) {
    var self = this;

    self.model.queryLocalizado('uspGetFechaEfectivaReporte', [], function(error, result) {
        self.view.expositor(res, { error: error, result: result });
    });
};

ApiSabana2.prototype.get_resumencarga = function(req, res, next) {
    var self = this;

    self.model.queryLocalizado('uspGetResumenCargaFinancieras', [], function(error, result) {
        self.view.expositor(res, { error: error, result: result });
    });
};

ApiSabana2.prototype.get_pivotviewdefault = function(req, res, next) {
    var self = this;

    self.model.queryLocalizado('uspGetSabanaPivotViewDefault', [], function(error, result) {
        self.view.expositor(res, { error: error, result: result });
    });
};

ApiSabana2.prototype.get_pivotviews = function(req, res, next) {
    var self = this;

    if (!req.query.idUsuario) {
        return res.status(400).json({ error: 'idUsuario es requerido' });
    }

    var params = [
        { name: 'idUsuario', value: req.query.idUsuario,        type: self.model.types.INT },
        { name: 'idEmpresa', value: req.query.idEmpresa || null, type: self.model.types.INT }
    ];

    self.model.queryLocalizado('uspGetSabanaPivotViews', params, function(error, result) {
        self.view.expositor(res, { error: error, result: result });
    });
};

ApiSabana2.prototype.post_pivotviews = function(req, res, next) {
    var self = this;

    if (!req.body.nombre || !req.body.config) {
        return res.status(400).json({ error: 'nombre y config son requeridos' });
    }

    var params = [
        { name: 'nombre',               value: req.body.nombre,                       type: self.model.types.STRING },
        { name: 'descripcion',          value: req.body.descripcion || null,          type: self.model.types.STRING },
        { name: 'configJson',           value: JSON.stringify(req.body.config),       type: self.model.types.STRING },
        { name: 'idEmpresa',            value: req.body.idEmpresa || null,            type: self.model.types.INT },
        { name: 'idUsuarioCreador',     value: req.body.idUsuarioCreador || null,     type: self.model.types.INT },
        { name: 'nombreUsuarioCreador', value: req.body.nombreUsuarioCreador || null, type: self.model.types.STRING }
    ];

    self.model.queryLocalizado('uspInsertSabanaPivotView', params, function(error, result) {
        self.view.expositor(res, { error: error, result: result });
    });
};

module.exports = ApiSabana2;
