var ApicrealoteView = require('../views/reference'),
    ApicrealoteModel = require('../models/dataAccess')
var soap = require('soap');
var parseString = require('xml2js').parseString;

var Apicrealote = function(conf) {
    this.conf = conf || {};

    this.view = new ApicrealoteView();
    this.model = new ApicrealoteModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

Apicrealote.prototype.get_cuentas = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT }];

    self.model.query('UspGetCuentas', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

Apicrealote.prototype.get_documentos = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT }];

    self.model.query('UspGetDocumentosPagos', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

Apicrealote.prototype.get_poliza = function(req, res, next) {

    var self = this;
    console.log('hi');
    console.log(req.query.tipo, req.query.factura, req.query.nodo)

    var url = this.conf.parameters.WSGeneraPdf;
    if (req.query.tipo && req.query.annio && req.query.mes && req.query.No && req.query.empresa) {
        var args = {
            PolTipo: req.query.tipo,
            PolAnio: req.query.annio,
            PolMes: req.query.mes,
            PolNo: req.query.No,
            Empresa: req.query.empresa
        };
        soap.createClient(url, function(err, client) {
            console.log(url)
            if (err) {
                console.log('Error 4', err)

                self.view.expositor(res, {
                    mensaje: "Hubo un problema intente de nuevo",
                });
            } else {
                console.log(args)
                client.GeneraPdfPolizaCompra(args, function(err, result, raw) {
                    if (err) {
                        console.log('Error 3', err)

                        self.view.expositor(res, {
                            mensaje: "Hubo un problema intente de nuevo",
                        });
                    } else {
                        parseString(raw, function(err, result) {
                            if (err) {
                                console.log('Error 2', err)

                                self.view.expositor(res, {
                                    mensaje: "Hubo un problema intente de nuevo",
                                });
                            } else {
                                // console.log('Llegue hasta el final');
                                // console.log(result["soap:Envelope"]["soap:Body"][0]["GeneraPdfPolizaCompraResponse"][0]["GeneraPdfPolizaCompraResult"][0], 'Lo logre?')
                                var arrayBits = result["soap:Envelope"]["soap:Body"][0]["GeneraPdfPolizaCompraResponse"][0]["GeneraPdfPolizaCompraResult"][0];
                                self.view.expositor(res, {
                                    result: {
                                        arrayBits: arrayBits
                                    }
                                });
                            }
                        });
                    }

                });
            }
        });
    } else {
        console.log('Error 1')
        self.view.expositor(res, {
            mensaje: "Hubo un problema intente de nuevo",
        });
    }
};

Apicrealote.prototype.get_lotes = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT }];

    self.model.query('UspGetLote', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
Apicrealote.prototype.get_escenarios = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT }];

    self.model.query('SEL_ESCENARIO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

Apicrealote.prototype.post_encabezadoPagos = function(req, res, next) {

    var self = this;
    // console.log(req.body.idEmpresa)
    var params = [{ name: 'idEmpresa', value: req.body.idEmpresa, type: self.model.types.INT },
        { name: 'idUsuario', value: req.body.idUsuario, type: self.model.types.INT },
        { name: 'nombreLote', value: req.body.nombreLote, type: self.model.types.STRING },
        { name: 'estatus', value: req.body.estatus, type: self.model.types.INT },
        { name: 'esApliacionDirecta', value: req.body.esAplicacionDirecta, type: self.model.types.INT },
        { name: 'cifraControl', value: req.body.cifraControl, type: self.model.types.INT },
        { name: 'interesAgrupado', value: req.body.interesAgrupado, type: self.model.types.INT }
    ];
    console.log(params, 'INS_PAG_PROG_PAGOS_SP')
    self.model.query('INS_PAG_PROG_PAGOS_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

Apicrealote.prototype.post_detalleLotePago = function(req, res, next) {
    var self = this;
    var arrayInsert = [];
    // console.log(req.query.idPadre)
    // var idPadre = req.query.idPadre;
    var params = [{ name: 'idPadre', value: req.query.idPadre, type: self.model.types.INT }];
    const obj = JSON.parse(req.body.datos);
    var table = '[Pagos].[dbo].[PAG_TABLA_PASO_POLIZAS]'
    var values = obj;
    self.model.queryInsert(table, values, function(error, result) {
        if (error) {
            // console.log(error)
            self.view.expositor(res, {
                error: error,
                result: result
            });
        } else {
            // console.log(params)
            self.model.query('INS_PROG_PAGOS_SP', params, function(error, result) {
                self.view.expositor(res, {
                    error: error,
                    result: result
                });
            });
        }

    });
};
Apicrealote.prototype.get_preDocumentos = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idPoliza', value: req.query.idPoliza, type: self.model.types.INT }
    ];

    self.model.query('UspGetDocumentosPagosPre', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

Apicrealote.prototype.get_crealoteFinanciera = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idFinancieraDestino', value: req.query.idFinancieraDestino, type: self.model.types.INT },
        { name: 'idFinancieraOrigen', value: req.query.idFinancieraOrigen, type: self.model.types.INT }
    ];

    self.model.query('TRAS_NUEVO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

Apicrealote.prototype.get_crealoteFinancieraDetalle = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idcrealoteFinanciera', value: req.query.idcrealoteFinanciera, type: self.model.types.INT },
        { name: 'idEsquemaOrigen', value: req.query.idEsquemaOrigen, type: self.model.types.INT },
        { name: 'idEsquemaDestino', value: req.query.idEsquemaDestino, type: self.model.types.INT },
        { name: 'CCP_IDDOCTO', value: req.query.CCP_IDDOCTO, type: self.model.types.STRING },
        { name: 'fechaPromesaPago', value: req.query.fechaPromesaPago, type: self.model.types.STRING }
    ];

    self.model.query('TRAS_NUEVODETALLE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
Apicrealote.prototype.get_setChangeSchema = function(req, res, next) {

    var self = this;

    var params = [{ name: 'CCP_IDDOCTO', value: req.query.CCP_IDDOCTO, type: self.model.types.STRING },
        { name: 'usuarioID', value: req.query.usuarioID, type: self.model.types.INT },
        { name: 'financieraID', value: req.query.financieraID, type: self.model.types.INT },
        { name: 'esquemaID', value: req.query.esquemaID, type: self.model.types.INT }
    ];

    self.model.query('Usp_Esquema_UPD', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

Apicrealote.prototype.get_procesacrealote = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idcrealoteFinanciera', value: req.query.idcrealoteFinanciera, type: self.model.types.INT }];

    self.model.query('TRAS_PROCESAcrealote_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
Apicrealote.prototype.get_crealoteFlujo = function(req, res, next) {

    var self = this;

    var params = [{ name: 'financieraDestino', value: req.query.financieraDestino, type: self.model.types.INT },
        { name: 'financieraOrigen', value: req.query.financieraOrigen, type: self.model.types.INT }
    ];

    self.model.query('TRAS_FJUJO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
Apicrealote.prototype.get_crealoteFinancieraFlujo = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idFinancieraDestino', value: req.query.idFinancieraDestino, type: self.model.types.INT },
        { name: 'idFinancieraOrigen', value: req.query.idFinancieraOrigen, type: self.model.types.INT },
        { name: 'flujo', value: req.query.flujo, type: self.model.types.INT }
    ];

    self.model.query('TRAS_NUEVOCONFLUJO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
Apicrealote.prototype.get_crealoteDetalleAutoriza = function(req, res, next) {

    var self = this;

    var params = [{ name: 'token', value: req.query.token, type: self.model.types.STRING }];

    self.model.query('TRAS_DETALLEAUTORIZA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
Apicrealote.prototype.get_ActualizaFechaPP = function(req, res, next) {

    var self = this;

    var params = [{ name: 'fecha', value: req.query.fecha, type: self.model.types.STRING },
        { name: 'idcrealote', value: req.query.idcrealote, type: self.model.types.INT }
    ];

    self.model.query('TRAS_UPDATEFECHAPP_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
Apicrealote.prototype.get_CambioFECHPROMPAGBPRO = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idcrealote', value: req.query.idcrealote, type: self.model.types.INT }];

    self.model.query('TRAS_CAMBIOFECHPROMPAGBPRO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
Apicrealote.prototype.get_cancelacrealoteConFlujo = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idcrealote', value: req.query.idcrealote, type: self.model.types.INT }];

    self.model.query('TRAS_CANCELAcrealoteCONFLUJO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
Apicrealote.prototype.get_obtieneTodos = function(req, res, next) {

    var self = this;

    var params = [];

    self.model.query('TRAS_GETALLPENDIENTES_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
Apicrealote.prototype.get_Detalle = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idcrealoteFinanciera', value: req.query.idcrealoteFinanciera, type: self.model.types.INT }];

    self.model.query('TRAS_SEL_GETDETALLE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
Apicrealote.prototype.get_actualizarCartera = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT }];

    self.model.query('PROC_ACTUALIZA_CARTERA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
Apicrealote.prototype.get_documentosNoEncontrados = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idPoliza', value: req.query.idPoliza, type: self.model.types.INT }
    ];

    self.model.query('usp_get_documentosNoEncontrados', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
module.exports = Apicrealote;