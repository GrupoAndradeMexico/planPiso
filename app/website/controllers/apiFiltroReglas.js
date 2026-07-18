var ApiFiltroReglasView  = require('../views/reference'),
    ApiFiltroReglasModel = require('../models/dataAccess');

var ApiFiltroReglas = function(conf) {
    this.conf  = conf || {};
    this.view  = new ApiFiltroReglasView();
    this.model = new ApiFiltroReglasModel({ parameters: this.conf.parameters });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

// GET /api/apiFiltroReglas/getReglas/?idUsuario=X
ApiFiltroReglas.prototype.get_getReglas = function(req, res, _next) {
    var self = this;

    var params = [
        { name: 'UsuarioId', value: req.query.idUsuario || null, type: self.model.types.INT }
    ];

    self.model.query('uspGetFiltroReglas', params, function(error, result) {
        self.view.expositor(res, { error: error, result: result });
    });
};

// POST /api/apiFiltroReglas/insertRegla/
// body: { idUsuario, nombre, expresion }
ApiFiltroReglas.prototype.post_insertRegla = function(req, res, _next) {
    var self = this;

    var params = [
        { name: 'UsuarioId', value: req.body.idUsuario, type: self.model.types.INT    },
        { name: 'Nombre',    value: req.body.nombre,    type: self.model.types.STRING },
        { name: 'Expresion', value: req.body.expresion, type: self.model.types.STRING }
    ];

    self.model.query('uspInsertFiltroRegla', params, function(error, result) {
        var payload = error
            ? { ok: false, mensaje: error.message || String(error) }
            : { ok: true,  id: result && result[0] ? result[0].Id : null };

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(payload));
        res.end('');
    });
};

// POST /api/apiFiltroReglas/updateRegla/
// body: { id, nombre, expresion }
ApiFiltroReglas.prototype.post_updateRegla = function(req, res, _next) {
    var self = this;

    var params = [
        { name: 'Id',        value: req.body.id,        type: self.model.types.INT    },
        { name: 'Nombre',    value: req.body.nombre,    type: self.model.types.STRING },
        { name: 'Expresion', value: req.body.expresion, type: self.model.types.STRING }
    ];

    self.model.query('uspUpdateFiltroRegla', params, function(error) {
        var payload = error
            ? { ok: false, mensaje: error.message || String(error) }
            : { ok: true };

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(payload));
        res.end('');
    });
};

// POST /api/apiFiltroReglas/deleteRegla/
// body: { id }
ApiFiltroReglas.prototype.post_deleteRegla = function(req, res, _next) {
    var self = this;

    var params = [
        { name: 'Id', value: req.body.id, type: self.model.types.INT }
    ];

    self.model.query('uspDeleteFiltroRegla', params, function(error) {
        var payload = error
            ? { ok: false, mensaje: error.message || String(error) }
            : { ok: true };

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(payload));
        res.end('');
    });
};

module.exports = ApiFiltroReglas;
