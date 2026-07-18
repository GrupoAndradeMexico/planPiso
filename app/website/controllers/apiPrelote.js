var ApiPreloteView  = require('../views/reference'),
    ApiPreloteModel = require('../models/dataAccess');

var ApiPrelote = function(conf) {
    this.conf  = conf || {};
    this.view  = new ApiPreloteView();
    this.model = new ApiPreloteModel({ parameters: this.conf.parameters });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function _escXml(val) {
    if (val === null || val === undefined) return '';
    return String(val)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function _formatDate(val) {
    if (!val) return '';
    var s = (val instanceof Date) ? val.toISOString() : String(val);
    // Quitar 'Z' o sufijo de zona horaria (+HH:MM) — CONVERT(DATETIME, ..., 126) no los acepta
    return s.replace(/Z$|[+-]\d{2}:\d{2}$/, '').slice(0, 23);
}

function _buildXml(unidades) {
    var rows = unidades.map(function(u) {
        return '<u>' +
            '<id_empresa>'        + (parseInt(u.IdEmpresa,    10) || 0) + '</id_empresa>'   +
            '<id_financiera>'     + (parseInt(u.IdFinanciera, 10) || 0) + '</id_financiera>' +
            '<serie>'             + _escXml(u.Serie)                    + '</serie>'         +
            '<ccp_iddocto>'       + _escXml(u.CCP_IDDOCTO)             + '</ccp_iddocto>'    +
            '<saldo_actual>'      + (u.Saldo_actual  || '')             + '</saldo_actual>'   +
            '<saldo_pp>'          + (u.SALDO_PP       || '')            + '</saldo_pp>'       +
            '<veh_situacion>'     + _escXml(u.VEH_SITUACION)           + '</veh_situacion>'  +
            '<validacion>'        + _escXml(u.Validacion)               + '</validacion>'    +
            '<fecha_vencimiento>' + _formatDate(u.Fecha_vencimiento)    + '</fecha_vencimiento>' +
            '<cartera>'           + _escXml(u.DES_CARTERA)             + '</cartera>'        +
            '</u>';
    });
    return '<unidades>' + rows.join('') + '</unidades>';
}

function _sendJson(res, payload) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(payload));
    res.end('');
}

// ── GET /api/apiPrelote/getPrelotes/?idUsuario=X ──────────────────────────────
ApiPrelote.prototype.get_getPrelotes = function(req, res, _next) {
    var self = this;

    var params = [
        { name: 'idUsuario', value: req.query.idUsuario || null, type: self.model.types.INT }
    ];

    self.model.query('uspGetPrelotes', params, function(error, result) {
        self.view.expositor(res, { error: error, result: result });
    });
};

// ── POST /api/apiPrelote/insertPrelote/ ───────────────────────────────────────
// body: { nombre, idUsuario, unidades: [...] }
// Todo el flujo (grupo + encabezados + detalle) ocurre en una sola transacción
// dentro de uspInsertPreloteCompleto — si algo falla, el SP hace ROLLBACK total.
ApiPrelote.prototype.post_insertPrelote = function(req, res, _next) {
    var self      = this;
    var nombre    = (req.body.nombre   || 'Pre-Lote').trim();
    var idUsuario = req.body.idUsuario;
    var unidades  = req.body.unidades  || [];

    if (!unidades.length) {
        _sendJson(res, { ok: false, mensaje: 'No hay unidades para procesar.' });
        return;
    }

    var xml = _buildXml(unidades);

    self.model.query('uspInsertPreloteCompleto', [
        { name: 'nombre',    value: nombre,    type: self.model.types.STRING },
        { name: 'idUsuario', value: idUsuario, type: self.model.types.INT    },
        { name: 'unidades',  value: xml,       type: self.model.types.STRING }
    ], function(err, result) {
        if (err) {
            _sendJson(res, { ok: false, mensaje: err.message || String(err) });
        } else {
            _sendJson(res, { ok: true, ppg_id: result && result[0] ? result[0].ppg_id : null });
        }
    });
};

// ── GET /api/apiPrelote/getPreloteVsSabana/?pplId=X ───────────────────────────
ApiPrelote.prototype.get_getPreloteVsSabana = function(req, res, _next) {
    var self = this;

    var params = [
        { name: 'pplId', value: req.query.pplId || null, type: self.model.types.INT }
    ];

    self.model.query('uspGetPreloteVsSabana', params, function(error, result) {
        self.view.expositor(res, { error: error, result: result });
    });
};

// ── POST /api/apiPrelote/cancelPrelote/ ───────────────────────────────────────
// body: { pplId }
ApiPrelote.prototype.post_cancelPrelote = function(req, res, _next) {
    var self = this;

    var params = [
        { name: 'pplId', value: req.body.pplId, type: self.model.types.INT }
    ];

    self.model.query('uspCancelPrelote', params, function(error) {
        var payload = error
            ? { ok: false, mensaje: error.message || String(error) }
            : { ok: true };
        _sendJson(res, payload);
    });
};

module.exports = ApiPrelote;
