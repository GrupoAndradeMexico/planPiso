var ApiNotificacionesView = require('../views/reference'),
    ApiNotificacionesModel = require('../models/dataAccess'),
    NodeCron = require('node-cron'),
    request = require('request')

var ApiNotificaciones = function(conf) {
    this.conf = conf || {};

    this.view = new ApiNotificacionesView();
    this.model = new ApiNotificacionesModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

ApiNotificaciones.prototype.get_reporteReduccion = function(req, res, next) {
    var self = this;
    var params = [{ name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT }];
    self.model.query('usp_get_notificacionesReduccion', params, function(error, result) {

        var contenidoReporte = {
            "detalle": result
        };
        var urlReport = self.conf.parameters.jsReport;
        // console.log('CONTEDIDO REPORTE', JSON.stringify(contenidoReporte));

        var data = {
            template: { 'name': 'reporteNotificacionesPP' },
            data: contenidoReporte
        }
        var options = {
            uri: urlReport,
            method: 'post',
            json: data
        }
        request(options).pipe(res);
    });
};

ApiNotificaciones.prototype.get_prontoPagar = function(req, res, next) {
    var self = this;
    var params = [{ name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT }];
    self.model.query('usp_get_notificacionProntoPago', params, function(error, result) {

        var contenidoReporte = {
            "detalle": result
        };
        var urlReport = self.conf.parameters.jsReport;
        // console.log('CONTEDIDO REPORTE', JSON.stringify(contenidoReporte));

        var data = {
            template: { 'name': 'reporteNotificacionesPP' },
            data: contenidoReporte
        }
        var options = {
            uri: urlReport,
            method: 'post',
            json: data
        }
        request(options).pipe(res);
    });
};

ApiNotificaciones.prototype.post_notificaciones = function(req, res, next) {
    var self = this;
    var params = [];
    var datosNotificacion = [];
    var arregloNotificaciones = [];
    self.model.query('usp_get_tipoNotificaciones', params, function(error, result) {
        // console.log(result);
        result.forEach(function callback(currentValue, index, array) {
            // console.log(currentValue, index, array)
            datosNotificacion.push(obtieneNotificaciones(currentValue, self));
        });
        Promise.all(datosNotificacion).then(function response(result) {
            // console.log('PORFAAAA', result)
            result.forEach(function callback(currentValue, index, array) {
                currentValue.forEach(function callback(currentValue, index, array) {
                    var url = self.conf.parameters.urlApi + self.conf.parameters.port + '/' + currentValue.api
                    // console.log(url);
                    var params2 = [{ name: 'identificador', value: currentValue.encabezado, type: self.model.types.STRING },
                        { name: 'idTipoNotificacion', value: currentValue.idTipoNotificacion, type: self.model.types.INT },
                        { name: 'descripcion', value: currentValue.detalle, type: self.model.types.STRING },
                        { name: 'idEmpresa', value: currentValue.idEmpresa, type: self.model.types.INT },
                        { name: 'idSucursal', value: currentValue.idSucursal, type: self.model.types.INT },
                        { name: 'linkBPRO', value: url, type: self.model.types.STRING },
                        { name: 'aprobador', value: currentValue.idUsuarioAutorizador, type: self.model.types.INT }
                    ];
                    // console.log(params2)
                    // console.log("=====================================")
                    arregloNotificaciones.push(insertaNotificaciones(params2, self));

                });
            });
            Promise.all(arregloNotificaciones).then(function response(result) {
                // console.log('MMMM')
                // console.log(result);
                self.view.expositor(res, {
                    result: 'Termino el proceso'
                });
            });
        });

    });
};

function obtieneNotificaciones(currentValue, self) {
    var self = self;
    // console.log('ENTRE', currentValue)
    var params2 = [{ name: 'idTipoNotificacionPP', value: currentValue.idTipoNotificacionPP, type: self.model.types.INT }];
    return new Promise(function(resolve, reject) {
        self.model.query(currentValue.sp, params2, function(error, result) {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }

        });
    })
}

function insertaNotificaciones(params2, self) {
    var self = self;
    // console.log(params2)
    return new Promise(function(resolve, reject) {
        self.model.query('usp_ins_notificacion', params2, function(error, result) {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }

        });
    })
}

module.exports = ApiNotificaciones;