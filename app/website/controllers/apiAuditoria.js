var ApiAuditoriaView = require('../views/reference'),
    ApiAuditoriaModel = require('../models/dataAccess'),
    XLSX = require('xlsx'),
    multer = require('multer'),
    fs=require('fs'),
    PDFParser=require('pdf2json');




var ApiAuditoria = function(conf) {
    this.conf = conf || {};

    this.view = new ApiAuditoriaView();
    this.model = new ApiAuditoriaModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};


ApiAuditoria.prototype.get_insertaAuditoria = function(req, res, next) {

    var self = this;
    var params = [ { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
    { name: 'idFinanciera', value: req.query.idFinanciera, type: self.model.types.INT },
    { name: 'idtipoAuditoria', value: req.query.idtipoAuditoria, type: self.model.types.INT },
    { name: 'idtipoColateral', value: req.query.idtipoColateral, type: self.model.types.INT }
];

    self.model.query('INS_Auditoria_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ApiAuditoria.prototype.get_Auditoria = function(req, res, next) {

    var self = this;
    var params = [{ name: 'idAuditoria', value: req.query.idAuditoria, type: self.model.types.INT }
          ];

    self.model.queryAllRecordSet('Get_Auditoria_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiAuditoria.prototype.get_guardarObservaciones = function(req, res, next) {

    var self = this;
    var params = [{ name: 'idAuditoriadetalle', value: req.query.idAuditoriadetalle, type: self.model.types.INT },
    { name: 'observaciones', value: req.query.observaciones, type: self.model.types.STRING }
          ];

    self.model.queryAllRecordSet('UPD_Observaciones_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiAuditoria.prototype.get_Auditorias = function(req, res, next) {

    var self = this;
    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT }
          ];

    self.model.queryAllRecordSet('Get_Auditorias_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ApiAuditoria.prototype.post_uploadpdf = function(req, res, next) {
    var filename = String(new Date().getTime());
  
    var storage = multer.diskStorage({
        destination: function(req, file, callback) {
            callback(null, './uploads/');
        },
        filename: function(req, file, callback) {

            callback(null, filename + '.pdf');
        }
    });

    var upload = multer({ storage: storage }).any();

    upload(req, res, function(err) {
        if (err) {
            return res.end("Error uploading file.");
        } else {
            return res.end(filename);
        }
    });
};
ApiAuditoria.prototype.get_savePdf = function(req, res, next) {
    var self = this;
    var params = [{ name: 'idAuditoria', value: req.query.idAuditoria, type: self.model.types.INT },
    { name: 'ruta', value: './uploads/'+ req.query.LayoutName, type: self.model.types.STRING }
          ];
 console.log( './uploads/'+ req.query.LayoutName );
    self.model.queryAllRecordSet('UPD_guardarPDF_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiAuditoria.prototype.get_readPdf = function(req, res, next) {
    var self = this;
  var binaryData = fs.readFileSync(req.query.ruta);
  var base64String = new Buffer(binaryData).toString("base64");
  var error=undefined;
        self.view.expositor(res, {
            error: error,
            result: base64String
        });
};
ApiAuditoria.prototype.get_cambiarEncontrada = function(req, res, next) {

    var self = this;
    var params = [{ name: 'idAuditoriadetalle', value: req.query.idAuditoriaDetalle, type: self.model.types.INT },
    { name: 'encontrada', value: req.query.encontrada, type: self.model.types.INT }
          ];

    self.model.queryAllRecordSet('UPD_cambiarEncontrada_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiAuditoria.prototype.get_guardarObservacionesGeneral = function(req, res, next) {

    var self = this;
    var params = [{ name: 'idAuditoriadetalle', value: req.query.idAuditoriadetalle, type: self.model.types.STRING },
    { name: 'observaciones', value: req.query.observaciones, type: self.model.types.STRING }
          ];

    self.model.queryAllRecordSet('UPD_ObservacionesGenerales_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiAuditoria.prototype.get_tiposAuditoria = function(req, res, next) {

    var self = this;
    var params = [];

    self.model.query('GET_TiposAuditoria_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiAuditoria.prototype.post_upload = function(req, res, next) {
    var filename = String(new Date().getTime());
  
    var storage = multer.diskStorage({
        destination: function(req, file, callback) {
            callback(null, './uploads/');
        },
        filename: function(req, file, callback) {

            callback(null, filename + '.xlsx');
        }
    });

    var upload = multer({ storage: storage }).any();

    upload(req, res, function(err) {
        if (err) {
            return res.end("Error uploading file.");
        } else {
            return res.end(filename);
        }
    });
};

ApiAuditoria.prototype.get_readLayout = function(req, res, next) {
    var result = undefined;
    var error = undefined;
    try {
        var self = this;
        var workbook = XLSX.readFile('./uploads/' + req.query.LayoutName);
        var sheet_name_list = workbook.SheetNames;
        var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
      
            if (xlData == undefined) {
                return res.end("Error uploading file.");
            } else {
                setTimeout(function() {
                    var fs = require("fs");
                    // console.log( __dirname + '\\uploaded\\' + req.query.LayoutName );
                    fs.unlink('./uploads/' + req.query.LayoutName, function(err) {
                        if (err) {
                            self.view.expositor(res, {
                                error: err,
                                result: result
                            });
                        } else {
                            self.view.expositor(res, {
                                error: error,
                                result: xlData
                            });

                        }
                    });
                }, 5000);
            }
      
    } catch (e) {
        console.log("Error", e);
        self.view.expositor(res, {
            error: e,
            result: result
        });
    }
};
ApiAuditoria.prototype.get_insExcelData = function(req, res, next) {

    var self = this;
    var itemObject = JSON.parse(req.query.lstUnidades);
  
        if(itemObject.dato1==undefined)
        itemObject.dato1=0;
        if(itemObject.dato2==undefined)
         itemObject.dato2=0;
        if(itemObject.dato3==undefined)
        itemObject.dato3='';
        if(itemObject.dato5==undefined)
        itemObject.dato5='';
        if(itemObject.dato6==undefined)
        itemObject.dato6='';
        if(itemObject.dato7==undefined)
        itemObject.dato7='';
        if(itemObject.dato8==undefined)
        itemObject.dato8='';
        if(itemObject.dato9==undefined)
        itemObject.dato9='';
        if(itemObject.consecutivo==undefined)
        itemObject.consecutivo=0;
    var params = [{ name: 'idAuditoria', value: itemObject.dato1, type: self.model.types.INT },
        { name: 'idexcel', value: itemObject.dato2, type: self.model.types.STRING },
        { name: 'modelo', value: itemObject.dato3, type: self.model.types.STRING },
        { name: 'VIN', value: itemObject.dato4, type: self.model.types.STRING},
        { name: 'colateral', value: itemObject.dato5, type: self.model.types.STRING },
        { name: 'codigo', value: itemObject.dato6, type: self.model.types.STRING },
        { name: 'fechaentrega', value: itemObject.dato7, type: self.model.types.STRING },
        { name: 'fecharepuve', value: itemObject.dato8, type: self.model.types.STRING },
        { name: 'clienteestatus', value: itemObject.dato9, type: self.model.types.STRING } ,
        { name: 'consecutivo', value: itemObject.consecutivo, type: self.model.types.INT }      
    ];

    self.model.query('TEMPORALLAYOUTAuditoria_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiAuditoria.prototype.get_ConciliacionAuditoria = function(req, res, next) {

    var self = this;
    var params = [];
    params = [{ name: 'idAuditoria', value: req.query.idAuditoria, type: self.model.types.INT }];
    self.model.query('GET_ConciliacionAuditoria_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiAuditoria.prototype.get_buscaVIN = function(req, res, next) {

    var self = this;
    var params = [{ name: 'vin', value: req.query.vin, type: self.model.types.STRING },
    { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT }
          ];

    self.model.queryAllRecordSet('Usp_buscaVIN', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiAuditoria.prototype.get_TiposColateral = function(req, res, next) {

    var self = this;
    var params = [];
    params = [{ name: 'financieraID', value: req.query.financieraID, type: self.model.types.INT }];
    self.model.query('GET_TiposColateral_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
module.exports = ApiAuditoria;