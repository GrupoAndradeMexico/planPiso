var ApiNewUnitsView = require('../views/reference'),
    ApiNewUnitsModel = require('../models/dataAccess')


var ApiNewUnits = function(conf) {
    this.conf = conf || {};

    this.view = new ApiNewUnitsView();
    this.model = new ApiNewUnitsModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};


ApiNewUnits.prototype.get_NewUnits = function(req, res, next) {

    var self = this;

    var params = [{ name: 'empresaID', value: req.query.empresaID, type: self.model.types.INT }];

    self.model.query('uspGetUnidadesNuevas', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ApiNewUnits.prototype.get_NewUnitsBySucursal = function(req, res, next) {

    var self = this;

    var params = [{ name: 'empresaID', value: req.query.empresaID, type: self.model.types.INT },
    { name: 'sucursalID', value: req.query.sucursalID, type: self.model.types.INT} ,
    { name: 'financieraID', value: req.query.financieraID, type: self.model.types.INT }];

    self.model.query('uspGetUnidadesNuevas', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiNewUnits.prototype.post_setUnitSchema = function(req, res, next) {

    var self = this;
    var fecha = req.body.fechaCalculo.replace('-', '').replace('-', '');
    var fechaini = req.body.fechainicio.replace('-', '').replace('-', '');
    var fechafn = req.body.fechafin.replace('-', '').replace('-', '');
    var params = [{ name: 'CCP_IDDOCTO', value: req.body.CCP_IDDOCTO, type: self.model.types.STRING },
    { name: 'userID', value: req.body.userID, type: self.model.types.INT },
    { name: 'esquemaID', value: req.body.esquemaID, type: self.model.types.INT },
    { name: 'fecha_Calculo', value: fecha, type: self.model.types.STRING },
    { name: 'fechainicio', value: fechaini, type: self.model.types.STRING },
    { name: 'fechafin', value: fechafn, type: self.model.types.STRING },
    { name: 'saldoInicial', value: req.body.saldoInicial, type: self.model.types.INT },
    { name: 'InteresInicial', value: req.body.interes, type: self.model.types.INT },
    { name: 'diasgracia', value: req.body.diasgracia, type: self.model.types.INT },
    { name: 'tipoEntrada', value: req.body.tipoEntrada, type: self.model.types.STRING },
    { name: 'idEmpresa', value: req.body.idEmpresa, type: self.model.types.INT },
    { name: 'idSucursal', value: req.body.idSucursal, type: self.model.types.INT },
    { name: 'numeroSerie', value: req.body.vin, type: self.model.types.STRING }];

    self.model.query('uspSetUnidadSchema', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiNewUnits.prototype.get_SaldoFinanciera = function(req, res, next) {

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

module.exports = ApiNewUnits;
