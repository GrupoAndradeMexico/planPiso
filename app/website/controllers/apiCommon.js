var ApiCommonView = require('../views/reference'),
    ApiCommonModel = require('../models/dataAccess')


var ApiCommon = function(conf) {
    this.conf = conf || {};

    this.view = new ApiCommonView();
    this.model = new ApiCommonModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};


ApiCommon.prototype.get_Sucursal = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT }
    ];

    self.model.query('SUCURSALBYUSUARIO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ApiCommon.prototype.get_TipoTiie = function(req, res, next) {

    var self = this;

    var params = [];

    self.model.query('Usp_TipoTiie_GET', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiCommon.prototype.get_TipoColateral = function(req, res, next) {

    var self = this;

    var params = [];

    self.model.query('Usp_TipoColateral_GET', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ApiCommon.prototype.get_currentTIIE = function(req, res, next) {

    var self = this;

    var params = [];

    self.model.query('CURRENTTIIE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiCommon.prototype.get_Financieras = function(req, res, next) {
    console.log('ENTRE')
    var self = this;

    var params = [{ name: 'empresaID', value: req.query.empresaID, type: self.model.types.INT }
                ,{ name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT }];
    

    self.model.query('uspGetFinanciera', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiCommon.prototype.get_Schemas = function(req, res, next) {

    var self = this;

    var params = [{ name: 'financieraID', value: req.query.financieraID, type: self.model.types.INT },
    { name: 'esquemaID', value: req.query.esquemaID, type: self.model.types.INT }
    ];

    self.model.query('uspGetEsquema', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiCommon.prototype.get_SchemasBP = function(req, res, next) {

    var self = this;

    var params = [{ name: 'financieraIDBP', value: req.query.financieraID, type: self.model.types.INT },
    { name: 'idempresa', value: req.query.idempresa, type: self.model.types.INT },
    { name: 'esquemaID', value: req.query.esquemaID, type: self.model.types.INT }
    ];

    self.model.query('uspGetEsquemaBP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiCommon.prototype.get_Catalog = function(req, res, next) {

    var self = this;

    var params = [{ name: 'catalogoID', value: req.query.catalogoID, type: self.model.types.INT }
    ];

    self.model.query('uspGetCatalogo', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ApiCommon.prototype.get_financieraSucursal = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT }
    ];

    self.model.query('UspGetFinancieraSucursal', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiCommon.prototype.get_Spreads = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT }        
    ];

    self.model.queryAllRecordSet('UspSpreads', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

module.exports = ApiCommon;