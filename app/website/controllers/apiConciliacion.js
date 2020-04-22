var ApiConciliacionView = require('../views/reference'),
    ApiConciliacionModel = require('../models/dataAccess')




var ApiConciliacion = function(conf) {
    this.conf = conf || {};

    this.view = new ApiConciliacionView();
    this.model = new ApiConciliacionModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};


ApiConciliacion.prototype.get_insExcelData = function(req, res, next) {

    var self = this;
    var itemObject = JSON.parse(req.query.lstUnidades);
    var params = [{ name: 'numeroSerie', value: itemObject.dato1, type: self.model.types.STRING },
        { name: 'valor', value: itemObject.dato2, type: self.model.types.INT },
        { name: 'interes', value: itemObject.dato3, type: self.model.types.INT },
        { name: 'consecutivo', value: itemObject.consecutivo, type: self.model.types.INT }
    ];

    self.model.query('TEMPORALLAYOUT_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ApiConciliacion.prototype.post_upload = function(req, res, next) {
    var filename = String(new Date().getTime());
    var multer = require('multer');
    var storage = multer.diskStorage({
        destination: function(req, file, callback) {
            callback(null, 'app_back/uploaded/');
        },
        filename: function(req, file, callback) {

            callback(null, filename + '.xlsx');
        }
    });

    var upload = multer({ storage: storage }).any();

    upload(req, res, function(err) {
        var result = undefined;
        var error = undefined;
        if (err) {
            error = "Error uploading file.";
        } else {
            result = filename;
        }
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiConciliacion.prototype.get_readLayout = function(req, res, next) {
    var result = undefined;
    var error = undefined;
    try {
        var self = this;
        var parseXlsx = require('excel');
        parseXlsx(__dirname + '\\uploaded\\' + req.query.LayoutName, function(err, data) {
            if (err) {
                return res.end("Error uploading file.");
            } else {
                setTimeout(function() {
                    var fs = require("fs");
                    // console.log( __dirname + '\\uploaded\\' + req.query.LayoutName );
                    fs.unlink(__dirname + '\\uploaded\\' + req.query.LayoutName, function(err) {
                        if (err) {
                            self.view.expositor(res, {
                                error: err,
                                result: result
                            });
                        } else {
                            self.view.expositor(res, {
                                error: error,
                                result: data
                            });

                        }
                    });
                }, 5000);
            }
        })
    } catch (e) {
        console.log("Error", e);
        self.view.expositor(res, {
            error: e,
            result: result
        });
    }
};
ApiConciliacion.prototype.get_validaExistencia = function(req, res, next) {

    var self = this;
    var itemObject = JSON.parse(req.query.lstUnidades);
    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idFinanciera', value: req.query.idFinanciera, type: self.model.types.INT },
        { name: 'periodo', value: req.query.periodo, type: self.model.types.INT },
        { name: 'anio', value: req.query.anio, type: self.model.types.INT }
    ];

    self.model.query('CONC_VALIDAEXISTENCIA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiConciliacion.prototype.get_Conciliacion = function(req, res, next) {

    var self = this;
    var itemObject = JSON.parse(req.query.lstUnidades);
    var params = [{ name: 'consecutivo', value: req.query.consecutivo, type: self.model.types.INT },
        { name: 'periodo', value: req.query.periodo, type: self.model.types.INT },
        { name: 'financiera', value: req.query.financiera, type: self.model.types.INT }
    ];

    self.model.query('uspGetConciliacion', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiConciliacion.prototype.get_AutorizacionDetalle = function(req, res, next) {

    var self = this;
    var itemObject = JSON.parse(req.query.lstUnidades);
    var params = [{ name: 'consecutivo', value: req.query.consecutivo, type: self.model.types.INT }];

    self.model.query('CONC_AUTORIZACIONDETALLE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiConciliacion.prototype.get_autorizadorDetalle = function(req, res, next) {

    var self = this;
    var itemObject = JSON.parse(req.query.lstUnidades);
    var params = [{ name: 'token', value: req.query.token, type: self.model.types.STRING }];

    self.model.query('CONC_AUT_AUTORIZADOR_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiConciliacion.prototype.get_autorizaConciliacion = function(req, res, next) {

    var self = this;
    var itemObject = JSON.parse(req.query.lstUnidades);
    var params = [{ name: 'token', value: req.query.token, type: self.model.types.STRING },
        { name: 'autoriza', value: req.query.autoriza, type: self.model.types.STRING },
        { name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.STRING }
    ];

    self.model.query('CONC_AUTORIZA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiConciliacion.prototype.get_CierreMes = function(req, res, next) {

    var self = this;
    var itemObject = JSON.parse(req.query.lstUnidades);
    var params = [{ name: 'periodo', value: req.query.periodo, type: self.model.types.INT }];

    self.model.query('GETCIERREDEMES_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiConciliacion.prototype.get_creaConciliacion = function(req, res, next) {

    var self = this;
    var itemObject = JSON.parse(req.query.lstUnidades);
    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
    { name: 'idFinanciera', value: req.query.idFinanciera, type: self.model.types.INT },
    { name: 'periodo', value: req.query.periodo, type: self.model.types.INT },
    { name: 'periodoAnio', value: req.query.periodoAnio, type: self.model.types.INT },
    { name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT }];

    self.model.query('CREACONCILIACION_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiConciliacion.prototype.get_creaConciliacionDetalle = function(req, res, next) {

    var self = this;
    var itemObject = JSON.parse(req.query.lstUnidades);
    var params = [{ name: 'idConciliacion', value: req.query.idConciliacion, type: self.model.types.INT },
    { name: 'CCP_IDDOCTO', value: req.query.CCP_IDDOCTO, type: self.model.types.STRING },
    { name: 'VIN', value: req.query.VIN, type: self.model.types.STRING },
    { name: 'interesGrupoAndrade', value: req.query.interesGrupoAndrade, type: self.model.types.INT },
    { name: 'interesFinanciera', value: req.query.interesFinanciera, type: self.model.types.INT },
    { name: 'interesAjuste', value: req.query.interesAjuste, type: self.model.types.INT },
    { name: 'situacion', value: req.query.situacion, type: self.model.types.INT }];

    self.model.query('CREACONCILIACIONDETALLE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiConciliacion.prototype.get_solicitaAutorizacion = function(req, res, next) {

    var self = this;
    var itemObject = JSON.parse(req.query.lstUnidades);
    var params = [{ name: 'consecutivo', value: req.query.consecutivo, type: self.model.types.INT },
    { name: 'estatus', value: req.query.estatus, type: self.model.types.INT },
    { name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },
    { name: 'idFinanciera', value: req.query.idFinanciera, type: self.model.types.INT },
    { name: 'periodoContable', value: req.query.periodoContable, type: self.model.types.INT },
    { name: 'anioContable', value: req.query.anioContable, type: self.model.types.INT }];

    self.model.query('CONC_SOLICITAAUTORIZA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiConciliacion.prototype.get_porAutorizar = function(req, res, next) {

    var self = this;
    var itemObject = JSON.parse(req.query.lstUnidades);
    var params = [];

    self.model.query('CONC_PORAUTORIZAR_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiConciliacion.prototype.get_generaConciliacion = function(req, res, next) {

    var self = this;
    var itemObject = JSON.parse(req.query.lstUnidades);
    var params = [{ name: 'periodo', value: req.query.periodo, type: self.model.types.INT },
    { name: 'anio', value: req.query.anio, type: self.model.types.INT },
    { name: 'financiera', value: req.query.financiera, type: self.model.types.INT }];

    self.model.query('CONC_ORQUESTACONCILIACION_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiConciliacion.prototype.get_obtieneConciliacion = function(req, res, next) {

    var self = this;
    var itemObject = JSON.parse(req.query.lstUnidades);
    var params = [];

    self.model.query('CONC_OBTIENETODAS_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiConciliacion.prototype.get_conciliaDetalle = function(req, res, next) {

    var self = this;
    var itemObject = JSON.parse(req.query.lstUnidades);
    var params = [{ name: 'idConciliacion', value: req.query.idConciliacion, type: self.model.types.INT }];

    self.model.query('CONC_DETALLE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiConciliacion.prototype.get_validaCancelacion = function(req, res, next) {

    var self = this;
    var itemObject = JSON.parse(req.query.lstUnidades);
    var params = [{ name: 'idConciliacion', value: req.query.idConciliacion, type: self.model.types.INT }];

    self.model.query('CONC_VALIDACANCELACION_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiConciliacion.prototype.get_CancelaConciliacion = function(req, res, next) {

    var self = this;
    var itemObject = JSON.parse(req.query.lstUnidades);
    var params = [{ name: 'idConciliacion', value: req.query.idConciliacion, type: self.model.types.INT }];

    self.model.query('CONC_CANCELACONCILIACION_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
module.exports = ApiConciliacion;