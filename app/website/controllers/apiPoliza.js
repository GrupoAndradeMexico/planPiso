var ApiPolizaView = require('../views/reference'),
    ApiPolizaModel = require('../models/dataAccess'),
    XLSX = require('xlsx'),
    multer = require('multer'),
    fs=require('fs'),
    PDFParser=require('pdf2json');




var ApiPoliza = function(conf) {
    this.conf = conf || {};

    this.view = new ApiPolizaView();
    this.model = new ApiPolizaModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};


ApiPoliza.prototype.get_obtienePeriodosActivos = function(req, res, next) {

    
    if(req.query.periodo==undefined)
    req.query.periodo=null;
    var self = this;
    var params = [{ name: 'empresaID', value: req.query.idEmpresa, type: self.model.types.INT },
    { name: 'periodo', value: req.query.periodo, type: self.model.types.STRING },
          ];

    self.model.queryAllRecordSet('Usp_CompensacionesHechas', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};    
ApiPoliza.prototype.get_CancelaPoliza= function(req, res, next) {
    var self = this;
    var params = [  { name: 'agencia', value: req.query.agencia, type: self.model.types.STRING },
    { name: 'documento', value: req.query.documento, type: self.model.types.STRING },
    { name: 'fechabusqueda', value: req.query.fechabusqueda, type: self.model.types.STRING },
    { name: 'horabusqueda', value: req.query.horabusqueda, type: self.model.types.STRING },
    { name: 'fechaSeleccionada', value: req.query.fecha, type: self.model.types.STRING }
          ];

    self.model.query('Usp_CancelaCompensacion', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};    
ApiPoliza.prototype.get_obtienePolizaApi= function(req, res, next) {
    var self = this;
    var params = [  { name: 'empresaID', value: req.query.empresaID, type: self.model.types.INT },
    { name: 'periodo', value: req.query.periodo, type: self.model.types.INT }
          ];

    self.model.query('usp_get_compensacionApi', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}; 
module.exports = ApiPoliza;