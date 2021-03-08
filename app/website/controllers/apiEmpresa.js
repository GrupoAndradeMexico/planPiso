var ApiEmpresasView = require('../views/reference'),
    ApiEmpresasModel = require('../models/dataAccess')


var ApiEmpresas = function(conf) {
    this.conf = conf || {};

    this.view = new ApiEmpresasView();
    this.model = new ApiEmpresasModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};


ApiEmpresas.prototype.get_Empresa = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT }];

    self.model.query('EMPRESABYUSER_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ApiEmpresas.prototype.get_UsuarioNombre = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT }];

    self.model.query('USUARIONOMBRE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiEmpresas.prototype.get_UsuarioPermisos= function(req, res, next) {

    var self = this;

    var params = [{ name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT }];

    self.model.queryAllRecordSet('USUARIOPermisos_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

module.exports = ApiEmpresas;
