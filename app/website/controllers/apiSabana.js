var ApiSabanaView    = require('../views/reference'),
    ApiSabanaModel   = require('../models/dataAccess'),
    generarExcel     = require('../reportGenerator').generarExcel;

var ApiSabana = function(conf) {
    this.conf  = conf || {};
    this.view  = new ApiSabanaView();
    this.model = new ApiSabanaModel({ parameters: this.conf.parameters });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

ApiSabana.prototype.get_getSabana = function(req, res, next) {
    var self = this;

    var params = [
        { name: 'idEmpresa',    value: req.query.idEmpresa    || null, type: self.model.types.INT },
        { name: 'idFinanciera', value: req.query.idFinanciera || null, type: self.model.types.INT }
    ];

    self.model.query('uspGetSabanaPlanPiso', params, function(error, result) {
        self.view.expositor(res, { error: error, result: result });
    });
};

ApiSabana.prototype.get_getExcel = function(req, res, next) {
    var self = this;

    var params = [
        { name: 'idEmpresa',    value: req.query.idEmpresa    || null, type: self.model.types.INT },
        { name: 'idFinanciera', value: req.query.idFinanciera || null, type: self.model.types.INT }
    ];

    self.model.query('uspGetSabanaPlanPiso', params, function(error, rows) {
        if (error) {
            return res.status(500).json({ error: error.message || error });
        }

        var fecha    = new Date().toISOString().slice(0, 10);
        var filename = 'sabana_plan_piso_' + fecha + '.xlsx';

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="' + filename + '"');

        generarExcel(rows)
            .then(function(wb) {
                return wb.xlsx.write(res);
            })
            .then(function() {
                res.end();
            })
            .catch(function(err) {
                if (!res.headersSent) {
                    res.status(500).json({ error: err.message });
                }
            });
    });
};

ApiSabana.prototype.post_getExcelSeleccionadas = function(req, res, _next) {
    var rows = req.body.rows;

    if (!Array.isArray(rows) || rows.length === 0) {
        return res.status(400).json({ error: 'No hay filas seleccionadas' });
    }

    var fecha    = new Date().toISOString().slice(0, 10);
    var filename = 'sabana_seleccionadas_' + fecha + '.xlsx';

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="' + filename + '"');

    generarExcel(rows)
        .then(function(wb) {
            return wb.xlsx.write(res);
        })
        .then(function() {
            res.end();
        })
        .catch(function(err) {
            if (!res.headersSent) {
                res.status(500).json({ error: err.message });
            }
        });
};

module.exports = ApiSabana;
