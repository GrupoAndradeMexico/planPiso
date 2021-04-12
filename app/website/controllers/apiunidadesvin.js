var ApiunidadesvinView = require('../views/reference'),
    ApiunidadesvinModel = require('../models/dataAccess')
    XLSX = require('xlsx'),
    multer = require('multer'),
    fs=require('fs');

var Apiunidadesvin = function(conf) {
    this.conf = conf || {};

    this.view = new ApiunidadesvinView();
    this.model = new ApiunidadesvinModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};



Apiunidadesvin.prototype.get_NewUnitsBySucursal = function(req, res, next) {

    var self = this;

    var params = [{ name: 'empresaID', value: req.query.empresaID, type: self.model.types.INT }
];

    self.model.query('uspGetUnidadesNuevasVin', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
Apiunidadesvin.prototype.post_setUnitSchema = function(req, res, next) {

    var self = this;
    var fecha = req.body.fechaCalculo.replace('-', '').replace('-', '');
    var fechaini = req.body.fechainicio.replace('-', '').replace('-', '');
    var fechafn = req.body.fechafin.replace('-', '').replace('-', '');
    var params = [{ name: 'CCP_IDDOCTO', value: req.body.vin, type: self.model.types.STRING },
    { name: 'idUsuario', value: req.body.userID, type: self.model.types.INT },
    { name: 'idEsquemaO', value: req.body.esquemaID, type: self.model.types.INT },
    { name: 'fechaInicio', value: fechaini, type: self.model.types.STRING },
    { name: 'montoFinanciar', value: req.body.saldoInicial, type: self.model.types.DECIMAL },
    { name: 'diasgracia', value: req.body.diasgracia, type: self.model.types.INT },
    { name: 'empresaID', value: req.body.idEmpresa, type: self.model.types.INT },
    { name: 'numeroSerie', value: req.body.vin, type: self.model.types.STRING }];

    self.model.query('Pol_Poliza14Detalle_INS', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
Apiunidadesvin.prototype.get_SaldoFinanciera = function(req, res, next) {

    var self = this;

    var params = [
    { name: 'idPersona', value: req.query.idPersona, type: self.model.types.INT} ,
    { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
    { name: 'idColateral', value: req.query.idColateral, type: self.model.types.INT }];

    self.model.query('usp_GetSaldoFinanciera', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

Apiunidadesvin.prototype.get_insExcelData = function(req, res, next) {

    var self = this;
    var itemObject = JSON.parse(req.query.lstUnidades);
if(itemObject.dato2==undefined)
itemObject.dato2=0;
if(itemObject.dato3==undefined)
itemObject.dato3=0;
if(itemObject.consecutivo==undefined)
itemObject.consecutivo=0;
    var params = [{ name: 'numeroSerie', value: itemObject.dato1, type: self.model.types.STRING },
        { name: 'valor', value: itemObject.dato2, type: self.model.types.DECIMAL },
        { name: 'fecha', value: itemObject.dato3, type: self.model.types.STRING },
        { name: 'consecutivo', value: itemObject.consecutivo, type: self.model.types.INT }
    ];

    self.model.query('TEMPORALLAYOUTUnidadesVin_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

Apiunidadesvin.prototype.post_upload = function(req, res, next) {
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
Apiunidadesvin.prototype.get_readLayout = function(req, res, next) {
    var result = undefined;
    var error = undefined;
    try {
        var self = this;
        var workbook = XLSX.readFile('./uploads/' + req.query.LayoutName,{type: 'binary', cellDates: true, dateNF: 'dd/mm/yyyy' });
        var sheet_name_list = workbook.SheetNames;
        var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]] );
      
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
Apiunidadesvin.prototype.get_readFile = function(req, res, next) {
    var self = this;
    // fs.mkdir('./create',function(e){
    //     if(!e || (e && e.code === 'EEXIST')){
    //         //do something with contents
    //     } else {
    //         //debug
    //         console.log(e);
    //     }
    // });
  var binaryData = fs.readFileSync('./files/LayoutUnidades.xlsx');
  var base64String = new Buffer(binaryData).toString("base64");
  var error=undefined;
        self.view.expositor(res, {
            error: error,
            result: base64String
        });
};
module.exports = Apiunidadesvin;
