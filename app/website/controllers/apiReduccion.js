var AapiReduccionView = require('../views/reference'),
    AapiReduccionModel = require('../models/dataAccess')


var AapiReduccion = function(conf) {
    this.conf = conf || {};

    this.view = new AapiReduccionView();
    this.model = new AapiReduccionModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};


AapiReduccion.prototype.get_EsquemaExpiration = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT }];

    self.model.query('ESQUEMAEXPIRATION_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


module.exports = AapiReduccion;
