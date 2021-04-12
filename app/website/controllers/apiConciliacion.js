var ApiConciliacionView = require('../views/reference'),
    ApiConciliacionModel = require('../models/dataAccess'),
    XLSX = require('xlsx'),
    multer = require('multer') ,
    fs=require('fs');




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
if(itemObject.dato2==undefined)
itemObject.dato2=0;
if(itemObject.dato3==undefined)
itemObject.dato3=0;
if(itemObject.consecutivo==undefined)
itemObject.consecutivo=0;
    var params = [{ name: 'numeroSerie', value: itemObject.dato1, type: self.model.types.STRING },
        { name: 'valor', value: itemObject.dato2, type: self.model.types.DECIMAL },
        { name: 'interes', value: itemObject.dato3, type: self.model.types.DECIMAL },
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
ApiConciliacion.prototype.get_readLayout = function(req, res, next) {
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
ApiConciliacion.prototype.get_validaExistencia = function(req, res, next) {

    var self = this;
    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idFinanciera', value: req.query.idFinanciera, type: self.model.types.INT },
        { name: 'periodo', value: req.query.periodo, type: self.model.types.INT },
        { name: 'anio', value: req.query.anio, type: self.model.types.INT },
        { name: 'tipo', value: req.query.idTipo, type: self.model.types.INT }
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
    var params = [{ name: 'consecutivo', value: req.query.consecutivo, type: self.model.types.INT },
        { name: 'periodo', value: req.query.periodo, type: self.model.types.INT },
        { name: 'anio', value: req.query.anio, type: self.model.types.INT },
        { name: 'financiera', value: req.query.financiera, type: self.model.types.INT }
    ];

    self.model.query('uspGetConciliacion', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiConciliacion.prototype.get_ConciliacionGuardada = function(req, res, next) {

    var self = this;
    var params = [{ name: 'idconciliacion', value: req.query.idconciliacion, type: self.model.types.INT }
    ];

    self.model.query('uspGetConciliacionGuardada', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ApiConciliacion.prototype.get_AutorizacionDetalle = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idconciliacion', value: req.query.consecutivo, type: self.model.types.INT }];

    self.model.query('CONC_AUTORIZACIONDETALLE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiConciliacion.prototype.get_autorizadorDetalle = function(req, res, next) {

    var self = this;
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
   
    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
    { name: 'idFinanciera', value: req.query.idFinanciera, type: self.model.types.INT },
    { name: 'periodo', value: req.query.periodo, type: self.model.types.INT },
    { name: 'periodoAnio', value: req.query.periodoAnio, type: self.model.types.INT },
    { name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },
    { name: 'idestatus', value: req.query.idEstatus, type: self.model.types.INT },
    { name: 'idtipo', value: req.query.idtipo, type: self.model.types.INT },
    { name: 'contador', value: req.query.contador, type: self.model.types.INT }];

    self.model.query('CREACONCILIACION_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiConciliacion.prototype.get_guardaConciliacion = function(req, res, next) {

    var self = this;
   
    var params = [{ name: 'idConciliacion', value: req.query.idConciliacion, type: self.model.types.INT },
    { name: 'idestatus', value: req.query.idEstatus, type: self.model.types.INT }];

    self.model.query('GUARDACONCILIACION_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiConciliacion.prototype.get_creaConciliacionDetalle = function(req, res, next) {

    var self = this;
   
    var params = [{ name: 'idConciliacion', value: req.query.idConciliacion, type: self.model.types.INT },
    { name: 'movimientoID', value: req.query.movimientoID, type: self.model.types.INT },
    { name: 'CCP_IDDOCTO', value: req.query.CCP_IDDOCTO, type: self.model.types.STRING },
    { name: 'VIN', value: req.query.VIN, type: self.model.types.STRING },
    { name: 'interesGrupoAndrade', value: req.query.interesGrupoAndrade, type: self.model.types.DECIMAL },
    { name: 'interesFinanciera', value: req.query.interesFinanciera, type: self.model.types.DECIMAL },
    { name: 'interesAjuste', value: req.query.interesAjuste, type: self.model.types.DECIMAL },
    { name: 'situacion', value: req.query.situacion, type: self.model.types.INT },
    { name: 'checked', value: req.query.checked, type: self.model.types.INT }];

    self.model.query('CREACONCILIACIONDETALLE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiConciliacion.prototype.get_guardaConciliacionDetalle = function(req, res, next) {

    var self = this;
   
    var params = [{ name: 'idConciliacion', value: req.query.idConciliacion, type: self.model.types.INT },
    { name: 'movimientoID', value: req.query.movimientoID, type: self.model.types.INT },
    { name: 'CCP_IDDOCTO', value: req.query.CCP_IDDOCTO, type: self.model.types.STRING },
    { name: 'VIN', value: req.query.VIN, type: self.model.types.STRING },
    { name: 'interesGrupoAndrade', value: req.query.interesGrupoAndrade, type: self.model.types.DECIMAL },
    { name: 'interesFinanciera', value: req.query.interesFinanciera, type: self.model.types.DECIMAL },
    { name: 'interesAjuste', value: req.query.interesAjuste, type: self.model.types.DECIMAL },
    { name: 'situacion', value: req.query.situacion, type: self.model.types.INT },
    { name: 'checked', value: req.query.checked, type: self.model.types.INT }];

    self.model.query('guardaCONCILIACIONDETALLE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiConciliacion.prototype.get_solicitaAutorizacion = function(req, res, next) {

    var self = this;
  
    var params = [{ name: 'consecutivo', value: req.query.consecutivo, type: self.model.types.INT },
  //  { name: 'estatus', value: req.query.estatus, type: self.model.types.INT },
    { name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },
    { name: 'idFinanciera', value: req.query.idFinanciera, type: self.model.types.INT },
    { name: 'periodoContable', value: req.query.periodoContable, type: self.model.types.INT },
    { name: 'anioContable', value: req.query.anioContable, type: self.model.types.INT },
    { name: 'idconciliacion', value: req.query.idconciliacion, type: self.model.types.INT }];

    self.model.query('CONC_SOLICITAAUTORIZA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiConciliacion.prototype.get_porAutorizar = function(req, res, next) {

    var self = this;
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
    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
    { name: 'periodo', value: req.query.periodo, type: self.model.types.INT },];


    self.model.query('CONC_OBTIENETODAS_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiConciliacion.prototype.get_conciliaDetalle = function(req, res, next) {

    var self = this;
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
   
    var params = [{ name: 'idConciliacion', value: req.query.idConciliacion, type: self.model.types.INT }];

    self.model.query('CONC_CANCELACONCILIACION_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiConciliacion.prototype.get_UnidadesCompraVirtual = function(req, res, next) {

    var self = this;
   
    var params = [{ name: 'idConciliacion', value: req.query.idConciliacion, type: self.model.types.INT }];

    self.model.query('CONC_UnidadesCompraVirtual_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiConciliacion.prototype.get_conciliacionPoliza = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },
    { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
    { name: 'idtipopoliza', value: req.query.idtipopoliza, type: self.model.types.INT }];

    self.model.query('Pol_Cabecera_INS', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ApiConciliacion.prototype.get_conciliacionPolizaDetalle = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idpoliza', value: req.query.idpoliza, type: self.model.types.INT },
    { name: 'idconciliacion', value: req.query.idconciliacion, type: self.model.types.INT },
    { name: 'idsucursal', value: req.query.idsucursal, type: self.model.types.INT },
    { name: 'VIN', value: req.query.VIN, type: self.model.types.STRING },
    { name: 'Marca', value: req.query.Marca, type: self.model.types.STRING },
    { name: 'Descripcion', value: req.query.Descripcion, type: self.model.types.STRING },
    { name: 'Modelo', value: req.query.Modelo, type: self.model.types.STRING },
    { name: 'Costo', value: req.query.Costo, type: self.model.types.DECIMAL },
    { name: 'idfinancieraO', value: req.query.idfinancieraO, type: self.model.types.INT },
    { name: 'idEsquemaO', value: req.query.idEsquemaO, type: self.model.types.INT },
    { name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT }];

    self.model.query('Pol_Poliza8Detalle_INS', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiConciliacion.prototype.get_MesConciliacion = function(req, res, next) {

    var self = this;

    var params = [ { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
    { name: 'idfinanciera', value: req.query.idFinanciera, type: self.model.types.INT }
    ];

    self.model.query('CONC_MESCONCILIACION_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiConciliacion.prototype.get_tiposConciliacion = function(req, res, next) {

    var self = this;
    var params = [];

    self.model.query('CONC_TIPOSCONCILIACION_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiConciliacion.prototype.get_obtienePeriodosActivos = function(req, res, next) {

    var self = this;
    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },];

    self.model.query('Get_PeriodosActivos_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiConciliacion.prototype.get_readFile = function(req, res, next) {
    var self = this;
    // fs.mkdir('./create',function(e){
    //     if(!e || (e && e.code === 'EEXIST')){
    //         //do something with contents
    //     } else {
    //         //debug
    //         console.log(e);
    //     }
    // });
  var binaryData = fs.readFileSync('./files/Layout.xlsx');
  var base64String = new Buffer(binaryData).toString("base64");
  var error=undefined;
        self.view.expositor(res, {
            error: error,
            result: base64String
        });
};
ApiConciliacion.prototype.get_abonoContable = function (req, res, next) {

    var self = this;

    var params = [
       
        { name: 'idconciliacion', value: req.query.id, type: self.model.types.INT }
    ];
    
    this.model.query('uspGetAbonoContable', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ApiConciliacion.prototype.get_cargoContable = function (req, res, next) {

    var self = this;

    var params = [
        { name: 'idconciliacion', value: req.query.id, type: self.model.types.INT }
    ];
    
    this.model.query('uspGetCargoContabilidad', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ApiConciliacion.prototype.get_abonoBancario = function (req, res, next) {

    var self = this;

    var params = [
      
        { name: 'idconciliacion', value: req.query.id, type: self.model.types.INT }
    ];
    
    this.model.query('uspGetAbonoFinanciera', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ApiConciliacion.prototype.get_cargoBancario = function (req, res, next) {

    var self = this;

    var params = [
        { name: 'idconciliacion', value: req.query.id, type: self.model.types.INT }
    ];
    
    this.model.query('uspGetCargosFinanciera', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiConciliacion.prototype.get_DatosReporte = function (req, res, next) {

    var self = this;

    var params = [
        { name: 'idconciliacion', value: req.query.id, type: self.model.types.INT }
    ];
    
    this.model.queryAllRecordSet('uspGetDatosreporte', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiConciliacion.prototype.get_previoConciliacion = function(req, res, next) {

    var self = this;
   
    var params = [{ name: 'idConciliacion', value: req.query.idConciliacion, type: self.model.types.INT }];

    self.model.query('PrevioCONCILIACION_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiConciliacion.prototype.get_cuentas = function(req, res, next) {

    var self = this;
   
    var params = [];

    self.model.query('usp_CuentasContables_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiConciliacion.prototype.get_insprevioConciliacion = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idConciliacion', value: req.query.idconciliacion, type: self.model.types.INT },
    { name: 'sucursalID', value: req.query.idsucursal , type: self.model.types.INT },
    { name: 'Interes', value: req.query.Interes, type: self.model.types.DECIMAL },
    { name: 'CTA_NUMCTA', value: req.query.CTA_NUMCTA, type: self.model.types.STRING },
    { name: 'usuarioID', value: req.query.usuarioID, type: self.model.types.INT }];

    self.model.query('INS_previoConciliacion_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiConciliacion.prototype.get_updprevioConciliacion = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idprevioconciliacion', value: req.query.idprevioconciliacion, type: self.model.types.INT },
        { name: 'idConciliacion', value: req.query.idconciliacion, type: self.model.types.INT },
    { name: 'sucursalID', value: req.query.idsucursal , type: self.model.types.INT },
    { name: 'Interes', value: req.query.Interes, type: self.model.types.DECIMAL },
    { name: 'CTA_NUMCTA', value: req.query.CTA_NUMCTA, type: self.model.types.STRING }];

    self.model.query('UPD_previoConciliacion_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ApiConciliacion.prototype.get_delprevioConciliacion = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idprevioconciliacion', value: req.query.idprevioConciliacion, type: self.model.types.INT },
    ];

    self.model.query('DEL_previoConciliacion_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiConciliacion.prototype.get_ConciliacionGuardadaPasivos = function(req, res, next) {

    var self = this;
    var params = [{ name: 'idconciliacion', value: req.query.idconciliacion, type: self.model.types.INT }
    ];

    self.model.query('uspGetConciliacionGuardadaPasivos', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
module.exports = ApiConciliacion;