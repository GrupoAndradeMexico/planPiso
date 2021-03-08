var ApiFechaPromesaView = require('../views/reference'),
    ApiFechaPromesaModel = require('../models/dataAccess')


var ApiFechaPromesa = function(conf) {
    this.conf = conf || {};

    this.view = new ApiFechaPromesaView();
    this.model = new ApiFechaPromesaModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};


ApiFechaPromesa.prototype.get_cartera = function(req, res, next) {

    var self = this;

    var params = [{ name: 'IdEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'IdProveedor', value: req.query.idPersona, type: self.model.types.INT },
        { name: 'Vencida', value: req.query.tipoCartera, type: self.model.types.INT }
    ];

    self.model.query('SEL_CARTERA_EMPPROV_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ApiFechaPromesa.prototype.post_pushCartera = function(req, res, next) {

    var self = this;

    var params = [{ name: 'IdCartera', value: req.body.idCartera, type: self.model.types.STRING },
        { name: 'IdEmpresa', value: req.body.idEmpresa, type: self.model.types.STRING },
        { name: 'FechaPromPago', value: req.body.fechaPromesa, type: self.model.types.STRING },
        { name: 'AnioCartera', value: req.body.anioCartera, type: self.model.types.STRING },
        { name: 'documento', value: req.body.documento, type: self.model.types.STRING }

    ];
    console.log(params)
    self.model.query('UPD_CARTERA_FECHAPROMPAGO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

module.exports = ApiFechaPromesa;