var ApiReporteView = require('../views/reference'),
    ApiReporteModel = require('../models/dataAccess'),
    NodeCron = require('node-cron'),
    Request = require('request')

var ApiReporte = function(conf) {
    this.conf = conf || {};

    this.view = new ApiReporteView();
    this.model = new ApiReporteModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

ApiReporte.prototype.get_reporteEmpresa = function(req, res, next) {

    var self = this;
    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.STRING }];

    self.model.query('usp_get_reporte', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ApiReporte.prototype.get_reporteUnidades = function(req, res, next) {

    var self = this;
    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.STRING },
        { name: 'idFinanciera', value: req.query.idFinanciera, type: self.model.types.STRING },
        { name: 'idEsquema', value: req.query.esquemaID, type: self.model.types.INT }
    ];

    self.model.query('usp_get_unidades_reporte', params, function(error, result) {
        // console.log(result)
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


module.exports = ApiReporte;